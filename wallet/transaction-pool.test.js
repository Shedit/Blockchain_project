const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');




describe('TransactionPool()', () => {
    let transaction, transactionPool, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool;
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet, 
            recipient: 'fake-recipient',
            amount: 50
        })
    });

    describe('setTransaction()', () => {
       
        it('add a transaction', () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id ])
                .toBe(transaction); 
        })
    });

    describe('existingTransaction()', () => {
        it('returns an input given an address', () => {
            
            transactionPool.setTransaction(transaction);
           
            expect(
                transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey }))
                    .toBe(transaction);

        });
    })
    
});