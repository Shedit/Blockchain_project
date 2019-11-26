// Starts up express and the application 

const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');
const PubSub = require('./pubsub');
 

const app = express();
const blockchain = new Blockchain(); 
const pubsub = new PubSub({ blockchain });
//GETrequest, used o read data from backend, 
//specifically a block instance from the blockchain
// endpoint will be 'api/blocks' 

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;





app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
     res.json(blockchain.chain)
});

app.post('/api/mine', (req, res) =>{
    const { data } = req.body;

    blockchain.addBlock({ data });

    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});


const syncChains = () => {
    request(`${ROOT_NODE_ADDRESS}/api/blocks`, function (error, response, body) {
        if(!error && response.statusCode === 200) {
            
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain); 
            blockchain.replaceChain(rootChain);
        }
    });

}
 
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()*1000)
}

const PORT = PEER_PORT || DEFAULT_PORT;


app.listen(PORT, () => {
    
    console.log(`Listening at port: ${PORT}`);
    if(PORT !== DEFAULT_PORT ){
        syncChains();
    }
    
});