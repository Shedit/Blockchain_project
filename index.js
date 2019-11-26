// Starts up express and the application 

const express = require('express');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');
const PubSub = require('./pubsub');


const app = express();
const blockchain = new Blockchain(); 
const pubsub = new PubSub({ blockchain });
//GETrequest, used o read data from backend, 
//specifically a block instance from the blockchain
// endpoint will be 'api/blocks' 

setTimeout(() => pubsub.broadcastChain(), 1000); 

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
     res.json(blockchain.chain)
});

app.post('/api/mine', (req, res) =>{
    const { data } = req.body;

    blockchain.addBlock({ data });

    res.redirect('/api/blocks');
});


const PORT = 3000; 
app.listen(PORT, () => console.log(`Listening at port: ${PORT}`));