import express from 'express';
import authroutes from './routes/auth.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectKafka } from './producer.js';
import cors from 'cors';
const app = express();
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100,
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 52, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(limiter);
app.use(helmet());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json({
    limit: '50mb'
}));
// connect kafka
connectKafka();
app.get('/', (req, res) => {
    res.send("This is security");
});
app.use('/api/auth', authroutes);
export default app;
