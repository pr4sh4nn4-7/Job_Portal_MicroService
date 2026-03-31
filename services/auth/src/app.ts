import express, { Request } from 'express'
import authroutes from './routes/auth.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { connectKafka } from './producer.js'
import cors from 'cors'
import { sql } from './utils/db.js'

const app = express()

async function initDb() {
  try {
    await sql`
Do $$
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM PG_TYPE WHERE typname='user_role') THEN
    CREATE TYPE user_role AS ENUM('jobseeker','recruiter');
  END IF; 
END$$;
`
    await sql`

CREATE TABLE IF NOT EXISTS users (
user_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL ,
phone_number VARCHAR(20) NOT NULL,
role user_role NOT NULL,
bio TEXT,
resume VARCHAR(255),
resume_public_id VARCHAR(255),
profile_pic VARCHAR(255),
profile_pic_public_id VARCHAR(255),
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
subscription TIMESTAMPTZ,
verification_code VARCHAR(6),
verified BOOLEAN DEFAULT false
)
`
    await sql`
CREATE TABLE IF NOT EXISTS skills (
skill_id SERIAL PRIMARY KEY,
name VARCHAR(200) NOT NULL UNIQUE
)

`

    await sql`
CREATE TABLE IF NOT EXISTS user_skills (
user_id INTEGER NOT NULL REFERENCES users(user_id) on DELETE CASCADE,

skill_id INTEGER NOT NULL REFERENCES skills(skill_id) on DELETE CASCADE,
PRIMARY KEY(user_id,skill_id)
)

`
    console.log('database successfully')
  } catch (err) {
    console.log(err)

  }

}
initDb()


const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 52, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})


app.use(cors({
  origin: "*",
  credentials: true
}))
app.use(limiter)
app.use(helmet())

app.use(express.urlencoded({
  extended: true
}))

app.use(express.json({
  limit: '50mb'
}))

// connect kafka
connectKafka()

app.get('/', (req, res) => {
  res.send("This is security")
})
app.use('/api/auth', authroutes)

export default app
