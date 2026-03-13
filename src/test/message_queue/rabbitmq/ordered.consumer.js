'use strict'

import amqp from "amqplib";
const URL_RABBITMQ = "amqp://guest:12345@localhost";


async function consumerOrderedMessage() {
    const conn = await amqp.connect(URL_RABBITMQ)
    const channel = await conn.createChannel();

    const queueName = 'ordered.queued.message';
    await channel.assertQueue(queueName, { durable: true })

    // Set predetch to 1 to ensure only one ack at a time
    channel.prefetch(1)

    channel.consume(queueName, msg => {
        const message = msg.content.toString()

        const random = Math.random() * 1000;
        setTimeout(() => {
            console.log('processed::', message)
            channel.ack(msg);
        }, random)
    })
}

consumerOrderedMessage().catch(err => console.error(err))