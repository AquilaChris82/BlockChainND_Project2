/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
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

  static genesisBlock() {
      let genesisBlock = new this("First block in the chain - Genesis block");
      genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString(); 
      return genesisBlock; 
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = level('./blockchaindata');
    this.chain.put(0,JSON.stringify(Block.genesisBlock()));
  }




  // Add new block
  async addBlock(newBlock){
        let minedBlock = await this.mineBlock(newBlock)
            this.chain.put(minedBlock.height,JSON.stringify(minedBlock))
            return minedBlock;
  }
    
  async mineBlock(){

        let l = await this.getBlockHeight();
        newBlock.height = l;
        console.log('new block height is'+l); 

        let prev = await this.getBlock(l-1);

        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0,-3);
          
        // previous block hash
        newBlock.previousBlockHash = prev.hash; 
        console.log('previous block hash is' + prev.hash);

        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();  
        return newBlock; 
  }


  // Get block height
  getBlockHeight(){
    console.log("getting Block height");
    return new Promise((resolve,reject)=>{
      let i = 0;
      this.chain.createReadStream().on('data', function(data) {
            i++;
            }).on('error', function(err) {
              reject('Unable to read data stream!', err)
            }).on('end', function() {
              console.log(i);
              resolve(i);
            });
      })
}

 
    // get block
    getBlock(blockHeight){
      console.log('getting block with key'+blockHeight);
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

