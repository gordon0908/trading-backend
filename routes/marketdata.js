const marketData = require('../api/market');

function generateMarketData(request, response) {
  if (request.params.symb) {
    marketData.getDataCB(request.params.symb, (data) => {
      response.send(data);
      response.end();
    });
  }else{
    response.status(404);
    response.json({message: 'symb required'});
  }
}

module.exports = generateMarketData;