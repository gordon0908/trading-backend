const cheerio = require('cheerio');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const cache = new NodeCache();

function parseData($){
    let tables = [];
    $('div[role="main"]').find('table').each((index, ele)=>{
        let table = [];
        $(ele).children().each((indexSub, eleSub)=>{
            if (eleSub.tagName == 'thead'){
                table.push(createTable($(eleSub).text()));
            }

            if (eleSub.tagName == 'tbody'){
                let keyMap = table[table.length -1].tableHead;
                let newRow = {};

                $(eleSub).find('td').each((indexSubId, eleSubId)=>{
                    if (keyMap[indexSubId]){
                        newRow[keyMap[indexSubId]] = $(eleSubId).text().trim().replace(/\s\s+/g, '');
                    }
                });

                table[table.length - 1].rows.push(newRow);
            }
        });

        tables.push(table);
    });
    return tables;
}
function createTable(thead){
    return {
        tableHead: formatText(thead), 
        rows: []
    }
}
function formatText(txt){
    return txt.trim().split(/\s+/g);
}

function callData(country) {
  return new Promise((resolve, reject) => {
    fetch('https://tradingeconomics.com/'+country+'/indicators').then(d=>d.text())
      .then(d=>{
        let $ = cheerio.load(d);
        let table = parseData($);
        resolve(table);
      });
  });
}

function getData(country) {
  let countryKey = 'indicator-' + country;

  return new Promise((resolve, reject) => {
    cache.get(countryKey, (error, data) => {
      if (error || !data) {
        let dataPromise = callData(country);
        dataPromise.then(result => {
          cache.set(countryKey, result);
          resolve(result);
        });
      }else{
        resolve(data);
      }
    });
  });
}

module.exports = getData;
