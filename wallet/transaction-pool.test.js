const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');



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
    
    describe('validTransactions()', () => {
        let validTransactions, errorMock; 

        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn(); 
            global.console.error = errorMock;


            for (let i = 0; i< 10; i++) { 
                transaction = new Transaction({
                    senderWallet, 
                    recipient: 'any-recipient', 
                    amount: 30,
                });
            

              if ( i%3 === 0) {
                    transaction.input.amount = 999999; 
                } else if (i%3 === 1) {
                    transaction.input.signature = new Wallet().sign('foo');
                } else {
                    validTransactions.push(transaction);
                }
              transactionPool.setTransaction(transaction); 
            }
        });

        it('returns VALID transactions', () => { 
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });

        it('logs errors for the invalid transaction', () => {
            transactionPool.validTransactions(); 
            expect(errorMock).toHaveBeenCalled(); 

        });
    });

    describe('clear()', () => {
        it('clears the transactions', () => { 
            
            transactionPool.setTransaction(transaction);

            transactionPool.clear();

            expect(transactionPool.transactionMap).toEqual({});
        });
    });

    describe('clearBlockchainTransactions()', () => {
        it('clears the pool of any existing transactions',() => {
            const blockchain = new Blockchain(); 
            const expectedTransactionMap = {}; 
            
            for ( let i = 0;  i < 6; i ++) {
                    
                    const transaction = new Wallet().createTransaction({ 
                        recipient: 'foo', 
                        amount: 20
                    });

                    transactionPool.setTransaction(transaction);

                    if (i%2===0) {
                        blockchain.addBlock({ data : [transaction] }); 
                    } else {
                        expectedTransactionMap[transaction.id] = transaction; 
                    }
            }
            
            transactionPool.clearBlockchainTransactions({ chain: blockchain.chain});

             expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        
            });
    });
});

