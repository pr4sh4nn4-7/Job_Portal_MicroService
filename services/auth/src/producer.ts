import { Kafka, Producer, Admin } from "kafkajs";
import fs from 'fs'

let producer: Producer;

let admin: Admin;

let NODE_VERSION = "dev"

export const connectKafka = async () => {

  const ssl = {
    rejectUnauthorized: true,
    ca: [fs.readFileSync(process.env.CA_PATH as string, 'utf-8')],
    key: fs.readFileSync(process.env.KEY_PATH as string, 'utf-8'),
    cert: fs.readFileSync(process.env.CERT_PATH as string, 'utf-8'),
  };
  try {
    const broker = process.env.KAFKA_BROKER;
    if (!broker) throw new Error("KAFKA_BROKER is not defined");
    const kafka = new Kafka({ clientId: "mail-service", brokers: [broker], ssl });

    admin = kafka.admin()
    await admin.connect()

    const topics = await admin.listTopics()
    if (!topics.includes("send-mail")) {
      await admin.createTopics({
        topics: [
          {
            topic: "send-mail",
            numPartitions: 1,
            replicationFactor: 1
          }]
      })
    }
    console.log("topic send-mail successful")

    await admin.disconnect()

    producer = kafka.producer()

    await producer.connect()

    console.log("connected to kafka producer")





  } catch (err) {
    console.log(err)

  }
}


// kafka producer setup 

export const publishToTopic = async (topic: string, message: any) => {
  if (!producer) {
    console.log(`kafka producer is not initialized`)
  }

  try {
    await producer.send({
      topic: topic,
      messages: [{
        value: JSON.stringify(message)
      }]
    })
  } catch (err) {
    console.log("Failed publisher: ", err)
  }

}

export const disconnectKafka = async () => {
  if (producer) {
    await producer.disconnect()
  }
}
