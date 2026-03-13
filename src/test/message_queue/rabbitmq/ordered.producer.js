'use strict'

import amqp from "amqplib";
const URL_RABBITMQ = "amqp://guest:12345@localhost";


async function producerOrderedMessage() {
    const conn = await amqp.connect(URL_RABBITMQ)
    const channel = await conn.createChannel();

    const queueName = 'ordered.queued.message';
    await channel.assertQueue(queueName, { durable: true })

    for (let i = 0; i <= 10; i++) {
        const message = `ordered-queued-message::${i}`;
        console.log(`message:${message}`);
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        });
    }

    setTimeout(() => { conn.close() }, 1000)
}

producerOrderedMessage().catch(err => console.error(err))