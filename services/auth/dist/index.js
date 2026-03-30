import app from './app.js';
import 'dotenv/config';
import { sql } from './utils/db.js';
import { createClient } from 'redis';
// redis setup
export const redisClient = createClient({
    url: process.env.REDIS_URL,
});
redisClient.connect().then(() => console.log('redis connection successfull')).catch(err => console.log(err));
// databse query setup
async function initDb() {
    try {
        await sql `
Do $$
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM PG_TYPE WHERE typname='user_role') THEN
    CREATE TYPE user_role AS ENUM('jobseeker','recruiter');
  END IF; 
END$$;
`;
        await sql `

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
`;
        await sql `
CREATE TABLE IF NOT EXISTS skills (
skill_id SERIAL PRIMARY KEY,
name VARCHAR(200) NOT NULL UNIQUE
)

`;
        await sql `
CREATE TABLE IF NOT EXISTS user_skills (
user_id INTEGER NOT NULL REFERENCES users(user_id) on DELETE CASCADE,

skill_id INTEGER NOT NULL REFERENCES skills(skill_id) on DELETE CASCADE,
PRIMARY KEY(user_id,skill_id)
)

`;
        console.log('database successfully');
    }
    catch (err) {
        console.log(err);
    }
}
initDb().then(() => {
    const port = process.env.PORT;
    app.listen(port, () => console.log(`Server started at http://localhost:${port}`));
});
// databse call
