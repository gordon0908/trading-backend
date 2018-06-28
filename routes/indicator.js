
const getData = require('../api/indicator');

module.exports = function(request, response) {
  const country = request.params.country;

  if (country) {
    getData(country)
      .then(result => {
        response.setHeader('Content-Type', 'application/json');
        response.json(result);
      })
      .catch(error => {
        response.status(404);
        response.json({ message: error });
      })
  } else {
    response.status(404);
    response.json({ message: 'country required' });
  }

}