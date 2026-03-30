import { Kafka } from "kafkajs";
import nodemailer from 'nodemailer';
let NODE_VERSION = 'dev';
export const startSendMailConsumer = async () => {
    try {
        const kafka = new Kafka({
            clientId: "mail-service",
            brokers: [NODE_VERSION == 'dev' ? 'localhost:9092' : 'kafka:9092']
        });
        const consumer = kafka.consumer({
            groupId: "mail-service-group"
        });
        await consumer.connect();
        const topicName = "send-mail";
        await consumer.subscribe({ topic: topicName, fromBeginning: false });
        console.log("successfully connected");
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const { to, subject, html } = await JSON.parse(message.value?.toString() || "{}");
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        auth: {
                            user: process.env.NODEMAILER_USER,
                            pass: process.env.NODEMAILER_PASS
                        }
                    });
                    await transporter.sendMail({
                        from: `PCareer<aelliot391@gmail.com>`,
                        to,
                        subject,
                        html: html
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};
