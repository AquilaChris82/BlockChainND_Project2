/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

//module.exports = function(){
// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  db.put(key, value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
}

// Get data from levelDB with key
function getLevelDBData(key){
  db.get(key, function(err, value) {
    if (err) return console.log('Not found!', err);
    console.log('Value = ' + value);
  })
}

// Add data to levelDB with value
/*function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
}
*/

function addDataToLevelDB(value) {
    return new Promise(function(resolve, reject){
                let i = 0;
                db.createReadStream()
                .on('data', function (data) {
                    i++;
                })
                .on('error', function (err) {
                    console.log("Alert! Add Data error!")
                    reject(err)
                })
                .on('close', function () {
                    console.log('Block #'+i);
                    addLevelDBData(i, value);
                    resolve(i);
                });
            });
  };
//};

(function theLoop (i) {
  setTimeout(function () {
    addDataToLevelDB(i, 'Testing data');
    if (--i) theLoop(i);
  }, 100);
})(10);
