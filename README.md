# Blockchain_project


## Background 

This project is intended to be a hands=on learning experience on blockchain, by build a blockchain in JavaScript from scratch it will enable for in-depth  practical knowledge of how blockchain actually work. 


## Learning goals 

- Be familiarized with JavaScript, specifically node.js 
- Undetstand in-depth how Blockchain and cryptocurrency work "under the hood". 
- Learn how to deploy an application from scratch with a front-end and a back-end. 



### Section 1 (Commit 1 and 2 )


- Set up the overall blockchain application.

- Created the basic building block of the 
blockchain - with blocks themselves!

- Started a test-driven development approach to the project.

- Built the genesis block - to get the blockchain going.

- Added functionality to mine a block - create a new block for the blockchain.

- Developed the important sha-256 hash function.

- Applied the hash to mine a block.


What I learned: 

- Learned the basics of the Javascript language 
- The difference between static and global functions in classes
- Understanding of the use of "this" in JavaScript. 

- Introduction to test-driven development TTD. 


### Section 2 (Commit 3 and 4)

- Created the fundamental blockchain class.

- Developed functionality to validate the blockchain, to allow for chain replacement.

- Implemented chain replacement.

- Investigated stubbing console output in tests to keep the output clean.


What I learned: 

- Additional understanding of the synergy between classes, when to use static functions and when not to. 

- Additional understanding of what a block and and blockchain consists of. 

- Additional understanding of TTD, how to structure describes within describes. 

### Section 3 (Commit 5 and 6)


- Implemented the proof of work system by adding a difficulty and nonce value to each block.

- Adjusted the difficulty for a block to ensure that blocks are mined at a rate which approaches a set mining rate for the system.

- Investigated the proof of work system by writing a script which checked how will the dynamic difficulty adjusted the system to approach the mine rate.

- Switched the hexadecimal character-based difficulty criteria to a more fine-grained binary bit-based difficulty criteria.

- Prevented a potential difficulty jump attack by adding extra validation for the blockchain.


What I've learned: 

Continuing of the testdriven development approach. 

- How to add an observation script to test and determine what type of conversion (hex or Bin) to use for the having a valid chain, working as intended. 

### Section 4: API and Network ()

The goal is in this section to form a network of nodes that interacts. 

To do this I will create an API which the different nodes can interact with each other. 

What the API stories (HTTP Requests): 

- The API should be able to read the blockchain data (GET-requests)

- The API should be able to write to the blockchain data (POSTrequests)

API Dependencies: 

- Express (V-server)


