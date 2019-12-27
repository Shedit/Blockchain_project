const Blockchain = require('./index');
const Block = require('./block');
const { cryptoHash } = require('../util');

describe('Blockchain', () => {
    let blockchain, newChain; 
    
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
    })

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('start with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'foo bar';
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain DOES NOT start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'fake-genesis'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });
        
        describe('when the chain DOES start with the genesis block AND has multiple blocks', () => {
            
        beforeEach(() => {
            blockchain.addBlock({ data : 'Bears'});
            blockchain.addBlock({ data : 'Beets'});
            blockchain.addBlock({ data : 'Star wars'});
            });
            
            describe('AND a lastHash reference has CHANGED', () => {
                it('returns false', () => {
            
                    blockchain.chain[2].lastHash = 'broken-lastHash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            
            describe('AND the chain CONTAINS a block with an invalid field', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'some-bad-evil-data';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('AND the chain CONTAINS a block with an undefined field', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = undefined;

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

                });
            })

            describe('AND the chain contains a a block with jumped difficulty', () => {
                it('returns false', () => {
                     const lastBlock = blockchain.chain[blockchain.chain.length-1]         
                     const lastHash = lastBlock.hash; 
                     const timestamp = Date.now(); 
                     const nonce = 0; 
                     const data = []; 
                     const difficulty = lastBlock.difficulty - 3; 
                     const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);
                     const badBlock = new Block({
                         timestamp, lastHash, hash, difficulty, nonce, data
                        });
                        
                     blockchain.chain.push(badBlock);
                     
                     expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('AND the chain DOES NOT contain any invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });


        });
    });

    describe('replaceChain()', () => {
        let errorMock, logMock;
        
        beforeEach (() => {
            errorMock = jest.fn(); 
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe('when the new chain IS NOT longer', () => {
            
            beforeEach(() => {
                newChain.chain[0] = { new: 'chain'}; 
                blockchain.replaceChain(newChain.chain)
            });

            it('DOES NOT replace chain', () => {
                expect(blockchain.chain).toEqual(originalChain)
            });

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled(); 
            });

        });

        describe('when the new chain IS longer', () => {
           
            beforeEach(() => {
                newChain.addBlock({ data : 'Bears'});
                newChain.addBlock({ data : 'Beets'});
                newChain.addBlock({ data : 'Star wars'});
                });
            describe('AND the chain is INVALID', () => {
                
                beforeEach(() => {
                    newChain.chain[2].hash = 'some-invalid-hash';
                    blockchain.replaceChain(newChain.chain)
                });
                
                it('DOES NOT replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain)
                });

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled(); 
                });
            });

            describe('AND the chain is VALID', () => {

                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain)
                });
                it('DOES replace the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain)
                })
                it('logs about the chain replacement', () => {
                    expect(logMock).toHaveBeenCalled();
                });
            })
            
        });
    });
});