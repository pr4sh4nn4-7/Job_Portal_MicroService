import express from 'express';
import companyroutes from './routes/company.js';
import helmet from 'helmet';
import jobroutes from './routes/job.routes.js';
import cors from 'cors';
const app = express();
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 100,
//   standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//   ipv6Subnet: 52, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
// })
app.use(cors({
    origin: "*",
    credentials: true
}));
// app.use(limiter)
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use('/api/job', jobroutes);
app.use('/api/company', companyroutes);
export default app;
