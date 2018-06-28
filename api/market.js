
const Client = require('node-rest-client').Client;
const resty  = new Client();
const exchanges = {}

module.exports =   {
   getData: function(symb, cb){
    let theURL = ["http://marketdata.websol.barchart.com/getHistory.json?key=58091a44a178075ed22e93053396bb67&symbol=" ,symb, "&type=daily&startDate=20150704000000"].join("");
   	resty.get(theURL , function (data, response) {
			cb(data);
		});
   },
   getDataCB: function(symb,cb){
    let theURL = ["http://marketdata.websol.barchart.com/getHistory.json?key=58091a44a178075ed22e93053396bb67&symbol=" ,symb, "&type=daily&startDate=20150704000000"].join("");
   	resty.get(theURL , function (data, response) {
			cb(JSON.stringify(data));
		});
   }
};
 
