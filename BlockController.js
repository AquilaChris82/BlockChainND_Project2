const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const ChainClass = require('./simpleChain.js')

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        
        this.blockchain = new ChainClass.Blockchain();
        //this.initializeBlockchain();
        //this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * establish connection to the "simpleChain" blockchain
     */
     //initializeBlockchain() {
     //   console.log(this.blockchain.chain);
     //}

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/api/block/:index", (req, res) => {
            // Add your code here
            let index = req.params.index;
            console.log('Block Index:', index)

            this.blockchain.getBlock(index)
            .then(
                function(block){
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.write(JSON.stringify(block)).toString();
                    res.end();
                })
            .catch(
                function(err){
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.write("Can't retrieve block"+err);
                    res.end();
                });
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/api/block", (req, res) => {
            // Add your code here
            let data = req.body.body;

            if (data.length == 0){
                console.log("Error - body is empty");
                res.writeHead(200, {"Content-Type": "application/json"});
                res.write("Error - body is empty");
                res.end();
            }
            else {
                let block = new BlockClass.Block(data);
                console.log('Post Block:', JSON.stringify(block));
                this.blockchain.addBlock(block)
                .then(
                    function(block){
                        res.writeHead(200, {"Content-Type": "application/json"});
                        res.write(JSON.stringify(block));
                        res.end();
                })
                
            }
            
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    /*
    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }
    */

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}