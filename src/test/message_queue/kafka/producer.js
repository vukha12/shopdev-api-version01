'use strict'

import { Kafka, logLevel } from 'kafkajs'

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.NOTHING
})

const producer = kafka.producer()

const runProducer = async () => {
    // Producing
    await producer.connect()
    await producer.send({
        topic: 'test-topic',
        messages: [
            { value: 'Hello KafkaJS user By Tips VuKha!' },
        ],
    })
}

runProducer().catch(console.error)