class TransactionMiner {
    constructor({ blockchain, transactionPool, wallet, pubsub}) {
        this.blockchain = blockchain; 
        this.transactionPool = transactionPool; 
        this.wallet = wallet; 
        this.pubsub = pubsub; 

        
    }
   
   
    mineTransaction() {
        // get the valid transactions in the transactionPool
        
        // generate the Miner's Reward

        // add a block with the valid transactions to the blockchain

        // broadcast the updated blocchain 

        // clear the pool

    }
}

module.exports = TransactionMiner;  