import 'dotenv/config';
const ssl = {
    ca: process.env?.KAFKA_CA?.replace(/\\n/g, '\n'),
    cert: process.env.KAFKA_CERT?.replace(/\\n/g, '\n'),
    key: process.env.KAFKA_KEY?.replace(/\\n/g, '\n'),
    rejectUnauthorized: true, // optional, default true
};
console.log(ssl.ca);
