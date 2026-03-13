import amqp from "amqplib";


const runConsumer = async () => {
    try {
        const conn = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await conn.createChannel();

        const nameQueue = 'test-topic';
        await channel.assertQueue(nameQueue, { durable: true });

        channel.consume(nameQueue, (message) => {
            console.log(`Received ${message.content.toString()}`)
        }, {
            noAck: true
        });
    } catch (error) {
        console.error("Error:", error.message)
    }
}

runConsumer().catch(console.error);