const Transaction = require('../wallet/transaction');

class TransactionMiner {
    constructor({ blockchain, transactionPool, wallet, pubsub}) {
        this.blockchain = blockchain; 
        this.transactionPool = transactionPool; 
        this.wallet = wallet; 
        this.pubsub = pubsub; 
    }
   
   
    mineTransactions() {
        // get the valid transactions in the transactionPool
        const validTransactions = this.transactionPool.validTransactions();
        
        // generate the Miner's Reward
        validTransactions.push(
            Transaction.rewardTransaction({minerWallet: this.wallet})
            );
        
        // add a block with the valid transactions to the blockchain
            this.blockchain.addBlock({ data: validTransactions })
        
        // broadcast the updated blockhchain 
            this.pubsub.broadcastChain();

        // clear the pool
        this.transactionPool.clear();

    }
}

module.exports = TransactionMiner;  