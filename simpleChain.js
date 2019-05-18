/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
//const addDataToLevelDB = require('./levelSandbox.js');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
  function addLevelDBData(key,value){
    db.put(key, value, function(err) {
      if (err) return console.log('Block ' + key + ' submission failed', err);
    })
  };

  // Get data from levelDB with key
  function getLevelDBData(key){
    db.get(key, function(err, value) {
      if (err) return console.log('Not found!', err);
      console.log('Value = ' + value);
    })
  };

  // Add data to levelDB with value
  function addDataToLevelDB(key, data) {
    console.log(data)
    return new Promise(function(resolve, reject){
                //let key = 0;
                let dataArray = [];
                db.createReadStream()
                .on('data', function (data) {
                    dataArray.push(data);
                    console.log(dataArray)
                    //key++;
                })
                .on('error', function (err) {
                    reject(err)
                })
                .on('close', function () {
                    //console.log(dataArray);
                    // requires key and value
                    resolve(addLevelDBData(key, dataArray));
                });
            });
  };


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = [];
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  // Add new block
  addBlock(newBlock){
    return new Promise(function(resolve, reject) {
    // do a thing, possibly async, then…

    // Block height
    newBlock.height = this.chain.length;
    
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(this.chain.length>0){
      newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
    }

    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    
    var added = addDataToLevelDB(newBlock.height, JSON.stringify(result).toString());
    
    if (added){
      resolve(self);
    }
    else {
        reject(Error());
      }
    });
  }
    

  // Get block height
    getBlockHeight(){
      return this.chain.length-1;
    }

    // get block
    getBlock(blockHeight){
      // return object as a single string
      return new Promise((resolve, reject) => {
            db.get(blockHeight, function(err, value) {
                if (err) return console.log('Not found!', err);
                resolve(value);
            });
        })
    }

    // validate block
    validateBlock(blockHeight){
      // get block object
      let block = this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    validateChain(){
      let errorLog = [];
      for (var i = 0; i < this.chain.length-1; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = this.chain[i].hash;
        let previousHash = this.chain[i+1].previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}

let myBlockChain = new Blockchain();
(function theLoop (i) {
    setTimeout(function () {
        let blockTest = new Block("Test Block - " + (i + 1));
        myBlockChain.addBlock(blockTest).then((result) => {
            console.log(result);
            i++;
            if (i < 10) theLoop(i);
        }).catch(function () {
     console.log("Promise Rejected");
});
    }, 10000);
  })(0);
