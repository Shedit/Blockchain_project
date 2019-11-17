const Blockchain = require('./blockchain');
const Block = require('./block');


describe('addBLock()', () => {
    let blockchain; 
    
    beforeEach(() => {
        blockchain = new Blockchain();
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
                })
            });

            describe('AND the chain DOES NOT contain any invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
});