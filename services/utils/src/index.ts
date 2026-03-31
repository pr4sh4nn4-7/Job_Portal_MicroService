import express from 'express'
import 'dotenv/config'
import utilrouter from './routes.js'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
import { startSendMailConsumer } from './consumer.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import './instrument.js'


// cloudinary setup

startSendMailConsumer()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

//limiter

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 52, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})


const app = express()

app.use(helmet())
app.use(limiter)
app.use(cors({
  origin: "*",
  credentials: true
}))
app.use(express.json({
  limit: '21mb'
}))
app.use(express.urlencoded({
  extended: true,
}))

app.get('/', (req, res) => {
  res.send("welcome to utils service")
})

app.use('/api/utils', utilrouter)
const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
