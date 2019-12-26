# Blockchain_project


## Background 

This project is intended to be a hands=on learning experience on blockchain, by build a blockchain in JavaScript from scratch it will enable for in-depth  practical knowledge of how blockchain actually work. 


## Learning goals 

- Be familiarized with JavaScript, specifically node.js 
- Understand in-depth how Blockchain and cryptocurrency work "under the hood". 
- Learn how to deploy an application from scratch with a front-end and a back-end. 



## Section 1 (Commit 1 and 2 )


- Set up the overall blockchain application.

- Created the basic building block of the 
blockchain - with blocks themselves!

- Started a test-driven development approach to the project.

- Built the genesis block - to get the blockchain going.

- Added functionality to mine a block - create a new block for the blockchain.

- Developed the important sha-256 hash function.

- Applied the hash to mine a block.


What I've learned: 

- Learned the basics of the Javascript language 
- The difference between static and global functions in classes
- Understanding of the use of "this" in JavaScript. 

- Introduction to test-driven development TTD. 


## Section 2 (Commit 3 and 4)

- Created the fundamental blockchain class.

- Developed functionality to validate the blockchain, to allow for chain replacement.

- Implemented chain replacement.

- Investigated stubbing console output in tests to keep the output clean.


What I've learned: 

- Additional understanding of the synergy between classes, when to use static functions and when not to. 

- Additional understanding of what a block and and blockchain consists of. 

- Additional understanding of TTD, how to structure describes within describes. 

## Section 3 (Commit 5 and 6)


- Implemented the proof of work system by adding a difficulty and nonce value to each block.

- Adjusted the difficulty for a block to ensure that blocks are mined at a rate which approaches a set mining rate for the system.

- Investigated the proof of work system by writing a script which checked how will the dynamic difficulty adjusted the system to approach the mine rate.

- Switched the hexadecimal character-based difficulty criteria to a more fine-grained binary bit-based difficulty criteria.

- Prevented a potential difficulty jump attack by adding extra validation for the blockchain.


What I've learned: 

Continuing of the testdriven development approach. 

- How to add an observation script to test and determine what type of conversion (hex or Bin) to use for the having a valid chain, working as intended. 

## Section 4: API and Network (commit 7 and 8 )

The goal is in this section to form a network of nodes that interacts. 

To do this I will create an API which the different nodes can interact with each other. 

What the API stories (HTTP Requests): 

- The API should be able to read the blockchain data (GET-requests)

- The API should be able to write to the blockchain data (POSTrequests)

API Dependencies: 

- Express (V-server)


Issues: 

 - Had issues with Nodemon installment in local, had to install globally. Probably something with virtualenv, or paths to do. Fixed for now. However, nodemon global dep. (npm i -g nodemon --save-dev)



 ### Real-time messaging network with PubSub 

 pubSub = Publisher/Subscriber: 

Allows for a node to ve publisher or/and subscriber to channels, where publisher broadcasts messages over all available channels and subscribers can the choose to subscribe to different channels. 

module name: Redis or PubNub (Choosing Redis)


### Handling multiple blockchain instances with different ports. 


Process of passing environment variables are not consistent in any of the shall environments across linux to windows

solution: 

npm i cross-env 

To sync new peers to the latest blockchain: 

dependencies: npm i request 

gives an opportunity to send GET requests in JS. 



Issues: 

Had an Issue with making the sync of chains function work. After an hour of searching it turned out to be that the localhost is over http, not http'S' which made the url request call function return undefined values in error, response and body. 

Removing redundancy: 

- now the first block:

- Syncs with itself

- Publish itself 



### Reflection 

What I've done in this section: 

- Set up an express API to allow for interaction to the backend through HTTP requests.

- Created a GET request to read the blockchain.

- Added a POST request to write new blocks to the blockchain.

- Implemented a real-time messaging network through Redis.

- Added the ability to broadcast chains.

- Started peers through alternate ports, and broadcasted chains when blocks were mined through the api.

- Synchronized chains when new peers connected to the network.

- Optimized the implementation to avoid redundant interaction.



What I've learned: 

It was tricky to understand the difference of post and get requests. I believe I have gotten a good overview of the concept. However in order to really understand what is going on under the hood I need ro dive in more into GET and POST requests, Publisher and Subscriber concepts and how to test/validate this type of connectivity in an efficient manner. 

I learned that HTTP and HTTPS are completely different when it comes to the package where the request callback return undefined on HttpS and work on Http requests. WHy is under investigation. 


## Section 5: Wallet, Keys and Transactions | The CryptoCurrency Backend (Commit 9)

The goal in this section is to add the capability to make transactions. 

Need to: 

- Add wallet
- Make and verify signatures
- Ability to make transactions




### Creation of transactions

In this subsection, I created the transaction module and tests for the module. 

- Created an update function, for handling multiple outputs. On a bug related to JS, were changing objects in "this" updates the whole object and discards the original given properties, thus treating equal statements as true if changed from original: Example: 

(Issue with re-signing a transaction) 


first give this object id 1, then change this object to have id 2, id 1 is discarded forever.  (hope that makes sense)


### Reflection 

in this Section I have accomplished the following: 

- Created the core wallet class for the cryptocurrency.

- Developed the cryptographic key pair and public key addressing system.

- Implementing signature generation and verification to make transactions official.

- Built the main transaction class - with the output map and input structure.

- Developed functionality to actually validate transactions.

- Tied transaction creation with the wallet class.

- Allowed transactions to be updated with multiple outputs to efficiently use existing objects.

- Improved the hash function to recognize objects with new properties as changes in incoming data.

- Covered edges cases with transaction updates to prevent vulnerabilities.



This section was the most challenging to keep my head straight, where there was a lot of test and other case I couldn't really wrap my head around and had to investigate further to really grasp the core concepts. I learned more about how 'this' works and how to write tests on a deeper level. 

## Section 6: The Transaction Pool 

In this section I did the following: 

- Created the core transaction pool with an ability to set transactions.


- Handled transaction through the API, and added API-generated transactions to the pool.

- Made sure invalid transactions did not go to the pool.

- Handled updates to transactions through the API.

- Exposed a new API method to read the transaction pool data.

- Broadcasted transactions as they occurred through the API.

- Synced the transaction pool map as a network-dependent object like the blockchain.


### Reflection 

This chapter the biggest challenges was to understand how the transactionPoolMap worked and how setTransactions work. There was issues knowing when to pass the object vs only passing values. 


## Section 7: The Mining block 

In this chapter I will be achieving the following: 


- Created the core transaction miner class to capture how miners should add transactions to the blockchain.

- Added the ability to grab valid transactions from the transaction pool.

- Added a way to clear blockchain transactions to ensure that only unique transaction objects could be recorded.

- Added a mining transactions endpoint to enable transaction mining through the API.

- Cleared recorded transactions on a successful replacement of the blockchain.

- Calculated the wallet balance based on the blockchain history.

- Applied these wallet balances whenever conducting a new transaction.

- Exposed the wallet information including the public key and balance through the API.

- Validated transaction data incoming into the blockchain.

- Validated incoming transaction input balances.

- Prevented duplicate transactions from appearing in a block’s data.

- Validated the entire transaction itself when accepting new user-contributed blockchains.


