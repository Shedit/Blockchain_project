// Starts up express and the application 

const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain/index');
const bodyParser = require('body-parser');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');
const https = require('https');


const isDevelopment = process.env.ENV === 'development';

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = isDevelopment ? 
`http://localhost:${DEFAULT_PORT}` :
'https://intense-wildwood-82940.herokuapp.com';
const REDIS_URL = isDevelopment ? 
'redis://127.0.0.1:6379' :
'redis://h:pdfc772eca829fb913d990d4ddb39e9276ab751c63e612ee4b03359c4bf9cdcc0@ec2-54-162-237-83.compute-1.amazonaws.com:8799';

const app = express();
const blockchain = new Blockchain(); 
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, redisUrl: REDIS_URL });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub }); 
const path = require('path');

//GETrequest, used o read data from backend, 
//specifically a block instance from the blockchain
// endpoint will be 'api/blocks' 







app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/blocks', (req, res) => {
     res.json(blockchain.chain)
});

app.get('/api/blocks/length', (req, res) => {
    res.json(blockchain.chain.length);
});

app.get('/api/blocks/:id', (req, res) => {
    const { id } = req.params;
    const { length } = blockchain.chain;

    const blocksReversed = blockchain.chain.slice().reverse();

    let startIndex = (id-1) * 5;
    let endIndex = id * 5;

    startIndex = startIndex < length ? startIndex : length; 
    endIndex = endIndex < length ? endIndex : length;

    res.json(blocksReversed.slice(startIndex, endIndex));
})

app.post('/api/mine', (req, res) =>{
    const { data } = req.body;

    blockchain.addBlock({ data });

    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});


app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body; 
    
    let transaction = transactionPool
        .existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if (transaction){
            transaction.update({ senderWallet: wallet, recipient, amount })
        } else{
            transaction = wallet.createTransaction({
                amount,
                recipient,
                chain: blockchain.chain });

        }
    } catch(error) {
       return res.status(400).json({ type: 'error', message: error.message }); 
    } 
     
    transactionPool.setTransaction(transaction); 
     
    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
});


app.get('/api/transaction-pool-map', (res, req) => {
    req.json(transactionPool.transactionMap)
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();

    res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;
    res.json({
        address,
        balance: Wallet.calculateBalance({ chain: blockchain.chain, address})
    }); 
});

app.get('/api/known-addresses', (req, res) => {
    const addressMap = {}; 

    for (let block of blockchain.chain) {
        for (let transaction of block.data){
            const recipient = Object.keys(transaction.outputMap); 

            recipient.forEach(recipient => addressMap[recipient] = recipient);
        }
    }

    res.json(Object.keys(addressMap));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'client/dist/index.html'));
});


const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, function (error, response, body) {
        if(!error && response.statusCode === 200) {
            
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain); 
            blockchain.replaceChain(rootChain);
        }
    });
        
    request({ url : `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, function (error, response, body) {
            if(!error && response.statusCode === 200) {
    
                const rootTransactionPoolMap = JSON.parse(body); 
    
                console.log('update transactionPool on a sync with', rootTransactionPoolMap);
    
                transactionPool.setMap(rootTransactionPoolMap)
            }
    });

};

// seeding the blockchain with some transactions
if (isDevelopment === true) {
    const walletFoo = new Wallet();
    const walletBar = new Wallet();
 
    const generateWalletTransactions = ({ wallet, recipient, amount }) => {
    const transaction =  wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);

    };

    const walletAction = () => generateWalletTransactions({
    wallet, recipient: walletFoo.publicKey, amount: Math.ceil(Math.random()*5)
    });

    const walletFooAction = () => generateWalletTransactions({
    wallet: walletFoo, recipient: walletBar.publicKey, amount: Math.ceil(Math.random()*10)
    });
 
    const walletBarAction = () => generateWalletTransactions({
    wallet: walletBar, recipient: wallet.publicKey, amount: Math.ceil(Math.random()*15)
    });


    for( let i=0; i < 20; i++) {
    if(i%3 === 0){
        walletAction();
        walletFooAction();
    } else if (i%3 === 1){
        walletAction();
        walletBarAction();
    } else {
        walletFooAction();
        walletBarAction();
    }
transactionMiner.mineTransactions();
    }
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()*1000)
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;


app.listen(PORT, () => {
    
    console.log(`Listening at port: ${PORT}`);
    if(PORT !== DEFAULT_PORT ){
        syncWithRootState();
    }
    
});