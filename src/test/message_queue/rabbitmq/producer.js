import amqp from "amqplib";

const messages = 'hello, RabbitMQ for Tips Javascript';

const runProducer = async () => {
    try {
        const conn = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await conn.createChannel();

        const nameQueue = 'test-topic';
        await channel.assertQueue(nameQueue, { durable: true });

        channel.sendToQueue(nameQueue, Buffer.from(messages));

        console.log(`message sent:`, messages);

    } catch (error) {
        console.error("Error:", error.message)
    }
}

runProducer().catch(console.error);