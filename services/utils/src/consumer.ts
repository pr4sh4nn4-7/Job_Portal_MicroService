import { Kafka } from "kafkajs";
import nodemailer from 'nodemailer'
import fs from 'fs'



export const startSendMailConsumer = async () => {
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

    const consumer = kafka.consumer({
      groupId: "mail-service-group"
    })
    await consumer.connect()

    const topicName = "send-mail"
    await consumer.subscribe({ topic: topicName, fromBeginning: false })

    console.log("successfully connected")

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {

          const { to, subject, html } = await JSON.parse(message.value?.toString() || "{}")



          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.NODEMAILER_USER,
              pass: process.env.NODEMAILER_PASS
            }
          })

          await transporter.sendMail({
            from: `PCareer<aelliot391@gmail.com>`,
            to,
            subject,
            html: html
          })

        } catch (err) {
          console.log(err)

        }
      }
    })

  } catch (err) {
    console.log(err)

  }

}
