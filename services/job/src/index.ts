import 'dotenv/config'
import app from "./app.js"
import { sql } from "./utils/db.js"
import { connectKafka } from './producer.js';
import './utils/instrument.js'

(async function() {
  try {
    await sql`
DO $$
BEGIN 
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type') THEN 
CREATE TYPE job_type AS ENUM ('full-time','part-time','contract','internship');
END IF;


IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_location') THEN 
CREATE TYPE work_location AS ENUM ('onsite','remote','hybrid');
END IF;



IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN 
CREATE TYPE application_status AS ENUM ('submitted','rejected','hired');
END IF;

END$$;

`;

    await sql`
CREATE TABLE IF NOT EXISTS companies (
company_id SERIAL PRIMARY KEY,
name varchar(244) NOT NULL UNIQUE,
description TEXT NOT NULL,
website VARCHAR(100) NOT NULL,
logo VARCHAR(255) NOT NULL,
logo_public_id VARCHAR(244) NOT NULL,
recruiter_id INTEGER NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;


    await sql`
CREATE TABLE IF NOT EXISTS jobs (
job_id  SERIAL PRIMARY KEY,
title varchar(244) NOT NULL,
description TEXT NOT NULL,
salary NUMERIC(10,2) ,
location VARCHAR(255) ,
job_type job_type NOT NULL,
openings NUMERIC(3,1) NOT NULL,
role VARCHAR(255) NOT NULL,
work_location work_location NOT NULL,
company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
posted_by_recruiter_id INTEGER NOT NULL,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);



`;
    //index on job
    /* 
    await sql`
 
CREATE INDEX IF NOT EXISTS index_job ON jobs(job_id,work_location);
`
*/

    await sql`
CREATE TABLE IF NOT EXISTS application (
application_id  SERIAL PRIMARY KEY,
job_id INTEGER NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
applicant_id INTEGER NOT NULL,
applicant_email VARCHAR(255) NOT NULL,
status application_status NOT NULL DEFAULT 'submitted',
resume VARCHAR(255) NOT NULL,
applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
subscribed BOOLEAN, 
UNIQUE (job_id,applicant_id),
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


`
    // applicationindex
    /*
        await sql`
    CREATE INDEX IF NOT EXISTS index_application ON application(application_id,applicant_email);
    `
    */
    console.log('job service created successfully')


  } catch (err: any) {
    console.log('job error' + err)

  }

})()



connectKafka()

const port = process.env.PORT




// app.listen(port, () => console.log(`SErver started http://localhost:${port}`))
export default app

