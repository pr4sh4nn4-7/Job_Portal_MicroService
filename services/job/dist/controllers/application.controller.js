import { publishToTopic } from "../producer.js";
import { applicationStatusUpdateTemplate } from "../template.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/error.js";
import { TryCatchHandler } from "../utils/TryCatchHandler.js";
import { jobIdSchema } from "../validator/job.validation.js";
export const updateApplication = TryCatchHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, 'Invalid Auth');
    }
    if (user.role !== 'recruiter') {
        throw new ErrorHandler(403, 'Forbidden request');
    }
    const { id } = req.params;
    // id is application id but i validate with job schema as both have same property
    const { error } = jobIdSchema.validate({
        jobId: id
    });
    if (error)
        throw new ErrorHandler(400, `${error.details[0].message}`);
    const [application] = await sql `SELECT * from application WHERE application_id = ${id}`;
    if (!application) {
        throw new ErrorHandler(404, "application not found");
    }
    const [job] = await sql `
SELECT posted_by_recruiter_id, title FROM jobs WHERE job_id = ${application.job_id}
`;
    if (!job) {
        throw new ErrorHandler(404, "job not found");
    }
    if (job.posted_by_recruiter_id !== user.user_id) {
        throw new ErrorHandler(403, "Forbidden!!");
    }
    const updatedApplication = await sql `

UPDATE application SET status = ${req.body.status} WHERE application_id =${id} 
RETURNING *
`;
    const message = {
        to: application.applicant_email,
        subject: "Application Update - Job portal",
        html: applicationStatusUpdateTemplate(job.title, updatedApplication[0]?.status)
    };
    publishToTopic("send-mail", message).catch(error => {
        console.error("failed to publish message to kafka", error);
    });
    console.log(id);
    if (updatedApplication[0].status == 'rejected') {
        await sql `Delete from application WHERE application_id =${id}`;
    }
    res.json({
        message: "application updated",
        updatedApplication
    });
});
