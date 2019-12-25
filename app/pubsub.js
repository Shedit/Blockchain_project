// pubsub - publisher subscriber, you can be a sender or a receiver. 
// Receiver = Listen to specific channels in a specific range of patterns (Don't have to address other nodes in network) 
// Sender = 

const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};


class PubSub {
    constructor ({ blockchain, transactionPool }) {
        this.blockchain = blockchain; 
        this.transactionPool = transactionPool;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();
        
        this.subscriber.on(
            'message',(channel, message) => this.handleMessage(channel, message)
        );
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}.`);

        const parsedMessage = JSON.parse(message);

        switch(channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage); 
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break; 
            default:
                return;
        }
    } 

    subscribeToChannels(channels) {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    } 

    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
        
        
    }

    broadcastChain() {
         this.publish({
             channel: CHANNELS.BLOCKCHAIN,
             message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }
}


// Debug code 
// const testPubSub = new PubSub();

// setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 1000);


module.exports = PubSub; 