import { Kafka } from "kafkajs";
let producer;
let admin;
let NODE_VERSION = "dev";
export const connectKafka = async () => {
    try {
        const kafka = new Kafka({
            clientId: "auth-service",
            brokers: [NODE_VERSION === "dev" ? "localhost:9092" : "kafka:9092"]
        });
        admin = kafka.admin();
        await admin.connect();
        const topics = await admin.listTopics();
        if (!topics.includes("send-mail")) {
            await admin.createTopics({
                topics: [
                    {
                        topic: "send-mail",
                        numPartitions: 1,
                        replicationFactor: 1
                    }
                ]
            });
        }
        console.log("topic send-mail successful");
        await admin.disconnect();
        producer = kafka.producer();
        await producer.connect();
        console.log("connected to kafka producer");
    }
    catch (err) {
        console.log(err);
    }
};
// kafka producer setup 
export const publishToTopic = async (topic, message) => {
    if (!producer) {
        console.log(`kafka producer is not initialized`);
    }
    try {
        await producer.send({
            topic: topic,
            messages: [{
                    value: JSON.stringify(message)
                }]
        });
    }
    catch (err) {
        console.log("Failed publisher: ", err);
    }
};
export const disconnectKafka = async () => {
    if (producer) {
        await producer.disconnect();
    }
};
