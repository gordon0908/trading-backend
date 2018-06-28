const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const session = require('express-session');
const errorHandler = require('errorhandler');
const path = require('path');
const config = require('./config');
const SocketIO = require('socket.io');
const marketData = require('./api/market');
const indicatorData = require('./api/indicator');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'templates'));

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookie.secret));
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
}));
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorHandler());
}


require('./routes')(app);

app.all('*', (request, response) => {
  response.json({ error: 'no page found' });
})

const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`server started port: ${app.get('port')}`);
});

process.on('uncaughtException', error => {
  console.error('system uncaughtException error ' + error);
  process.exit(0);
});

process.on('unhandledRejection', error => {
  console.error('system unhandledRejection error ' + error);
  process.exit(0);
});

function reboot() {
  server.listen(app.get('port'), () => {
    console.log(`server started port: ${app.get('port')}`);
  });
}

function exit() {
  server.close();
}

const io = SocketIO(server);

io.on('connection', (socket) => {
  
  socket.emit('newInstance', {sockId: socket.id});

  socket.on('getHistory', (symbl) => {
      marketData.getData(symbl.company, (data) => {

          io.to(socket.id).emit('marketData', data);
      });
  });

  socket.on('disconnect', function() {
      console.log('Got disconnect!');
  });

  socket.on('getHistoryM', (symbl) => {
      marketData.getData(symbl.company, (data) => {
          io.to(socket.id).emit('dataLookup', data);
      });
  });

  socket.on('gitIndicator', (country) => {
    indicatorData(country).then(data => {
      io.to(socket.id).emit('indicatorData', data);
    }); 
  });
});


if (require.main === module) {
  reboot();
} else {
  exports.reboot = reboot;
  exports.port = app.get('port');
  exports.exit = exit;
}