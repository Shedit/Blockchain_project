const hexToBinary = require('hex-to-binary');
const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const { cryptoHash } = require('../util');


describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-lastHash';
    const hash = 'bar-hash';
    const data = ['Blockchain', 'data']; 
    const nonce = 1; 
    const difficulty = 1;
    
    const block = new Block({
        timestamp : timestamp, 
        lastHash : lastHash,
        hash : hash,
        data : data,
        nonce : nonce,
        difficulty : difficulty
    });

    it('has a timestamp, lastHash, hash and data properties', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        it('returns a block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('return the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined';
        const minedBlock = Block.mineBlock({lastBlock, data})

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash)
        })

        it('sets the data', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a timestamp', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined)
        });

        it('create a SHA-256 `hash` based on the proper inputs', () => {
            expect(minedBlock.hash)
            .toEqual(
                cryptoHash(
                    minedBlock.timestamp,
                    minedBlock.nonce,
                    minedBlock.difficulty,
                    lastBlock.hash,
                    data
                )
            );
        });

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
            .toEqual("0".repeat(minedBlock.difficulty));
        }); 

        it('adjusts difficulty', () => {
            const possibleResults = [lastBlock.difficulty +1, lastBlock.difficulty -1];
            
            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true); 
        });
    });

    describe('adjustDifficulty()', () => {
        it('it raises the difficulty of too fast mined block', () => {
            expect(
                Block.adjustDifficulty({ 
                    originalBlock : block, 
                    timestamp : block.timestamp + MINE_RATE - 100 
                })).toEqual(block.difficulty + 1);
        });
        it('lowers the difficulty for a to slow mined block', () => {
            expect(
                Block.adjustDifficulty({ 
                    originalBlock : block, 
                    timestamp : block.timestamp + MINE_RATE + 100 
                })).toEqual(block.difficulty - 1);
        });

        it('has a lower limit of 1 ', () => {
            block.difficulty = -1; 

            expect(Block.adjustDifficulty({ originalBlock : block })).toEqual(1);
        });
    });

}); 

