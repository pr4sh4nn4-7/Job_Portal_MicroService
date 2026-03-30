import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/error.js";
import { TryCatchHandler } from "../utils/TryCatchHandler.js";
import { filterJobSchema, jobIdSchema, jobSchema, updateSchema } from "../validator/job.validation.js";
import { companyIdSchema } from "../validator/company.validator.js";
export const createJob = TryCatchHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, 'Invalid Auth');
    }
    if (user.role !== 'recruiter') {
        throw new ErrorHandler(403, 'Forbidden request');
    }
    const { title, role, description, salary, location, job_type, work_location, company_id, openings } = req.body;
    const { value, error } = jobSchema.validate({
        title,
        description,
        salary,
        location,
        job_type,
        work_location,
        company_id,
        openings,
        role
    });
    if (error) {
        throw new ErrorHandler(400, `${error.details[0].message}`);
    }
    const [newJob] = await sql `
INSERT INTO jobs (title,description,salary,location,role,job_type,work_location,company_id,posted_by_recruiter_id,openings) VALUES
(${value.title},${value.description},${value.salary},${value.location},${value.role},
${value.job_type},${value.work_location},${value.company_id},${user?.user_id},${value.openings})
RETURNING *
`;
    res.json({
        message: "Job posted successfully!!",
        success: true,
        job: newJob
    });
});
export const updateJob = TryCatchHandler(async (req, res, next) => {
    const user = req.user;
    const jobId = req.params.jobId;
    const { value: val, error: err } = jobIdSchema.validate({
        jobId
    });
    if (err) {
        if (err)
            throw new ErrorHandler(400, `${err?.details[0].message}`);
    }
    const { title, role, description, salary, location, job_type, work_location, company_id, openings, is_active } = req.body;
    const { error } = updateSchema.validate({
        title,
        role,
        description,
        salary,
        location,
        job_type,
        work_location,
        company_id,
        openings,
        is_active
    });
    if (error)
        throw new ErrorHandler(400, `${error?.details[0].message}`);
    const [existingjob] = await sql `
SELECT posted_by_recruiter_id FROM jobs WHERE job_id =${jobId}
`;
    if (!existingjob)
        throw new ErrorHandler(404, 'job not found');
    if (existingjob.posted_by_recruiter_id !== user?.user_id)
        throw new ErrorHandler(403, 'Forbidden: Not allowed');
    const [updatedjob] = await sql `
UPDATE jobs SET title=${title},description=${description},
salary=${salary},
location=${location},
role= ${role},
job_type=${job_type},
work_location=${work_location},
openings=${openings},
is_active=${is_active}
WHERE job_id =${jobId}
RETURNING *`;
    res.json({
        message: "job updated successfully",
        success: true,
        job: updatedjob
    });
});
export const getallActiveJobs = TryCatchHandler(async (req, res, next) => {
    const { title, location } = req.query;
    const { error } = filterJobSchema.validate({
        title,
        location
    });
    if (error)
        throw new ErrorHandler(400, `${error.details[0].message}`);
    let querystring = `
SELECT 
  j.job_id,j.is_active, j.title, j.description, j.salary, j.location, j.job_type, j.role, j.work_location, j.created_at,
  c.name AS company_name, c.logo AS company_logo, c.company_id
FROM jobs j
JOIN companies c ON j.company_id = c.company_id
WHERE j.is_active = true
`;
    const values = [];
    let paramIndex = 1;
    if (title) {
        querystring += ` AND j.title ILIKE $${paramIndex}`;
        values.push(`%${title}%`);
        paramIndex++;
    }
    if (location) {
        querystring += ` AND j.location ILIKE $${paramIndex}`;
        values.push(`%${location}%`);
        paramIndex++;
    }
    querystring += ` ORDER BY j.created_at DESC`;
    const result = await sql.query(querystring, values);
    res.json({
        message: "Job fetched successfully",
        data: result
    });
});
export const getSingleJOb = TryCatchHandler(async (req, res, next) => {
    const jobId = req.params.jobId;
    const { error } = jobIdSchema.validate({
        jobId
    });
    if (error) {
        throw new ErrorHandler(400, `${error?.details[0].message}`);
    }
    const [job] = await sql `SELECT * FROM jobs WHERE job_id=${jobId}`;
    res.json(job);
});
export const getAllApplicationForjob = TryCatchHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, 'Invalid Auth');
    }
    if (user.role !== 'recruiter') {
        throw new ErrorHandler(403, 'Forbidden request');
    }
    const { jobId } = req.params;
    const { error } = jobIdSchema.validate({
        jobId
    });
    if (error)
        throw new ErrorHandler(400, `${error.details[0].message}`);
    const [job] = await sql `
SELECT posted_by_recruiter_id FROM jobs WHERE job_id = ${jobId}
`;
    if (!job)
        throw new ErrorHandler(404, 'job not found');
    if (job.posted_by_recruiter_id != user.user_id) {
        throw new ErrorHandler(403, "Forbidden Not allowed!!");
    }
    const applications = await sql `
SELECT * FROM application WHERE job_id = ${jobId} ORDER BY subscribed DESC, applied_at ASC
`;
    res.json({
        message: 'application of job fetched successfully',
        data: applications
    });
});
export const deleteJOb = TryCatchHandler(async (req, res, next) => {
    const user = req.user;
    const { jobId } = req.params;
    const { error } = companyIdSchema.validate({
        companyId: jobId
    });
    if (error) {
        throw new ErrorHandler(400, `${error.details[0].message}`);
    }
    const [company] = await sql `
SELECT title,description from jobs WHERE job_id=${jobId} AND company_id= ${user?.user_id}

`;
    if (!company) {
        throw new ErrorHandler(404, "company not found!! or not authorized!!");
    }
    await sql `
DELETE FROM jobs WHERE company_id = ${jobId}
`;
    res.json({
        message: "job have  been deleted successfully",
        success: true
    });
});
