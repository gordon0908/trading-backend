const os = require('os');
const exec = require('child_process').execSync;

const systemdata = {
  gen: [
    {
      'Node.js Version': process.version
    },
    {
      'Npm Version': exec('npm --version').toString()
    },
    {
      'OS Type': os.type()
    },
    {
      'OS Platform': os.platform()
    },
    {
      'CPUS': os.cpus().toLocaleString()
    }
  ],
  poll: [
    {
      'Memory Used': Math.round((os.totalmem() - os.freemem()) / 1024 / 1024) + 'MB'
    },
    {
      'Memory Free': Math.round(os.freemem() / 1024 / 1024) + 'MB'
    }
  ]
};

module.exports = function(request, response) {
  const datatype = request.params[Object.keys(request.params)[0]];

  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cash-Control', 'no-cache, no-store');

  response.json(systemdata[datatype]);
};
