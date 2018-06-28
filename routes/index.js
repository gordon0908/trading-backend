module.exports = function(app) {
  app.get(/\/info\/(gen|poll)/, require('./info'));
  app.get('/indicator/:country', require('./indicator'));
  app.get('/marketdata/:symb', require('./marketdata'));
};

