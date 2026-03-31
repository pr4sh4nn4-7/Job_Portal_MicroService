import express from 'express'
import 'dotenv/config'
import userroutes from './routes/user.routes.js'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 52, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})


const app = express()
console.log(process.env.DB_URL)

app.use(cors({
  origin: "*",
  credentials: true
}))
app.use(limiter)
app.use(helmet())
app.use(express.json())
app.use('/api/user', userroutes)

const port = process.env.PORT || 8005

export default app
