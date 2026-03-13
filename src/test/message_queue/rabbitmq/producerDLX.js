'use strict';

import amqp from "amqplib";
const URL_RABBITMQ = "amqp://guest:12345@localhost";

// const log = console.log

// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments))
// }

const runProducerDLX = async () => {
    try {
        const conn = await amqp.connect(URL_RABBITMQ);
        const channel = await conn.createChannel();

        const notiExchange = 'noti.ex';
        const notiQueue = 'noti.queue';
        const notiExchangeDLX = 'noti.dlx';
        const notiRoutingKeyDLX = 'noti.key.dlx';

        // 1. create Exchange
        await channel.assertExchange(notiExchange, 'direct', { durable: true })

        // 2. create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,
            deadLetterExchange: notiExchangeDLX,
            deadLetterRoutingKey: notiRoutingKeyDLX
        })

        // 3. bindQueue
        await channel.bindQueue(queueResult.queue, notiExchange);

        // 4. send message
        const msg = 'a new product';

        console.log(`producer msg::`, msg);

        await channel.sendToQueue(queueResult.queue, Buffer.from(msg),
            { expiration: '10000' });

        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 500)
    } catch (error) {
        console.error(`Error runProducerDLX:::`, error.message)
    }
}

runProducerDLX().then(rs => console.log(rs)).catch(console.error)