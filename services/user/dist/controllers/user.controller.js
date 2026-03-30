"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApplication = exports.applyForJob = exports.deleteSkillFromUser = exports.addSkillToUser = exports.UpdateResume = exports.UpdateProfilePic = exports.updateUserProfile = exports.getUserProfile = exports.MyProfile = void 0;
const db_js_1 = require("../utils/db.js");
const file_type_1 = require("file-type");
const error_js_1 = __importDefault(require("../utils/error.js"));
const TryCatchHandler_js_1 = require("../utils/TryCatchHandler.js");
const user_js_1 = require("../validator/user.js");
const buffer_js_1 = __importDefault(require("../utils/buffer.js"));
const axios_1 = __importDefault(require("axios"));
exports.MyProfile = (0, TryCatchHandler_js_1.TryCatchHandler)(async (req, res, next) => {
    const user = req?.user;
    res.json(user);
});
exports.getUserProfile = (0, TryCatchHandler_js_1.TryCatchHandler)(async (req, res, next) => {
    const { userId } = req.params;
    const { error } = user_js_1.userIdSchema.validate({
        userId
    });
    if (error)
        throw new error_js_1.default(400, `${error.details[0].message}`);
    const users = await (0, db_js_1.sql) `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.phone_number,
        u.role,
        u.bio,
        u.resume,
        u.resume_public_id,
        u.profile_pic,
        u.profile_pic_public_id,
        u.subscription,
        ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills
      FROM users u
      LEFT JOIN user_skills us ON u.user_id = us.user_id
      LEFT JOIN skills s ON us.skill_id = s.skill_id
      WHERE u.user_id = ${userId}
      GROUP BY u.user_id
    `;
    if (users.length === 0) {
        throw new error_js_1.default(401, "User doesn't exist");
    }
    const user = users[0];
    user.skills = user.skills || [];
    res.json(user);
});
exports.updateUserProfile = (0, TryCatchHandler_js_1.TryCatchHandler)(async (req, res, next) => {
    // const { userId } = req.params
    //
    // const { error: err } = userIdSchema.validate({
    //   userId
    // })
    // if (err) throw new ErrorHandler(400, `${err.details[0].message}`)
    const user = req?.user;
    //
    // if (!user || !userId) {
    //   throw new ErrorHandler(401, "Invalid auth")
    // }
    const { name, phoneNumber, bio } = req.body;
    console.log(phoneNumber);
    const { value, error } = user_js_1.profileSchema.validate({
        name,
        phone_number: phoneNumber,
        bio
    });
    if (error) {
        throw new error_js_1.default(400, `${error.details[0].message}`);
    }
    const newName = value.name ?? user?.name;
    const newPhonenunber = value.phone_number ?? user?.phone_number;
    const newBio = value.bio ?? user?.bio;
    const [updatedUser] = await (0, db_js_1.sql) `
UPDATE users SET name = ${newName} , phone_number= ${newPhonenunber},
bio = ${newBio} WHERE users.user_id = ${user?.user_id}
RETURNING user_id, name, email, phone_number, bio
`;
    res.json({
        message: "profile updated!!", success: true,
        profile: updatedUser
    });
});
exports.UpdateProfilePic = (0, TryCatchHandler_js_1.TryCatchHandler)(async (req, res, next) => {
    const user = req.user;
    console.log(user);
    if (!user) {
        throw new error_js_1.default(401, "Invalid auth");
    }
    // double validation  with extension and buffer
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];
    const file = req.file;
    if (!file) {
        throw new error_js_1.default(400, "No image file uploaded");
    }
    async function validateIMAGE(file) {
        if (!file?.buffer) {
            throw new Error("File buffer is missing");
        }
        const type = await (0, file_type_1.fileTypeFromBuffer)(file.buffer);
        if (!type || !allowedMimeTypes.includes(type.mime)) {
            throw new error_js_1.default(400, "Only Images are allowd");
        }
    }
    await validateIMAGE(file);
    const oldPublicId = user.profile_pic_public_id;
    const fileBuffer = await (0, buffer_js_1.default)(file);
    if (!fileBuffer || !fileBuffer.content) {
        throw new error_js_1.default(500, "failed to generate buffer");
    }
    const { data: UploadResult } = await axios_1.default.post(`${process.env.UPLOAD_SERVICE}/upload`, {
        buffer: fileBuffer.content,
        public_id: oldPublicId
    });
    const [updateduser] = await (0, db_js_1.sql) `
UPDATE users SET profile_pic =${UploadResult.url}, profile_pic_public_id = ${UploadResult.public_id} WHERE email =${user.email} RETURNING user_id, name, profile_pic;
`;
    res.json({
        message: "profile_pic uploaded",
        success: true,
        updateduser
    });
});
exports.UpdateResume = (0, TryCatchHandler_js_1.TryCatchHandler)(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new error_js_1.default(401, "Invalid auth");
    }
    const file = req.file;
    // validate whether file is pdf or not
    async function validatePDF(file) {
        if (!file?.buffer) {
            throw new Error("File buffer is missing");
        }
        const type = await (0, file_type_1.fileTypeFromBuffer)(file.buffer);
        if (!type || type.mime !== "application/pdf") {
            throw new error_js_1.default(400, "Only pdf_file are allowd");
        }
    }
    await validatePDF(file);
    if (!file) {
        throw new error_js_1.default(400, "No pdf file uploaded");
    }
    const oldPublicId = user.resume_public_id;
    const fileBuffer = await (0, buffer_js_1.default)(file);
    if (!fileBuffer || !fileBuffer.content) {
        throw new error_js_1.default(500, "failed to generate buffer");
    }
    const { data: UploadResult } = await axios_1.default.post(`${process.env.UPLOAD_SERVICE}/upload`, {
        buffer: fileBuffer.content,
        public_id: oldPublicId
    });
    const [updateduser] = await (0, db_js_1.sql) `
  UPDATE users SET resume =${UploadResult.url}, resume_public_id = ${UploadResult.public_id} WHERE email =${user.email} RETURNING user_id, name, resume;
  `;
    res.json({
        message: "resume uploaded",
        success: true,
        updateduser
    });
});
exports.addSkillToUser = (0, TryCatchHandler_js_1.TryCatchHandler)(async (req, res, next) => {
    const userId = req.user?.user_id;
    const { error: err } = user_js_1.userIdSchema.validate({
        userId
    });
    if (err)
        throw new error_js_1.default(400, `${err.details[0].message}`);
    const { skillName } = req.body;
    const { value, error } = user_js_1.SkillNameSchema.validate({
        skillName: skillName
    });
    if (error) {
        throw new error_js_1.default(400, `${error.details[0].message}`);
    }
    let wasSkillAdded = false;
    try {
        // "BEGIN" started a transaction
        await (0, db_js_1.sql) `
BEGIN
`;
        const users = await (0, db_js_1.sql) `
SELECT user_id FROM users WHERE user_id = ${userId}
`;
        if (users.length === 0) {
            throw new error_js_1.default(404, "User not found.");
        }
        // insert the name in skills if name is conflict then or not conflict update the name value if the value is same
        const [skill] = await (0, db_js_1.sql) `
  INSERT INTO skills (name)
  VALUES (${value.skillName})
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING skill_id
`;
        const skillId = skill.skill_id;
        const insertionResult = await (0, db_js_1.sql) ` INSERT INTO user_skills (user_id, skill_id)
  VALUES (${userId}, ${skillId})
  ON CONFLICT (user_id, skill_id) DO NOTHING
  RETURNING user_id;`;
        if (insertionResult.length > 0) {
            wasSkillAdded = true;
        }
        // finalizing the transaction if successfull
        await (0, db_js_1.sql) `COMMIT`;
    }
    catch (err) {
        // if error rollback to previous state 
        await (0, db_js_1.sql) `ROLLBACK`;
        throw err;
    }
    if (!wasSkillAdded) {
        return res.status(400).json({
            message: "User already possesses this skill",
            success: false
        });
    }
    res.json({
        message: `skill ${skillName.trim()} is added successfully`,
        success: true
    });
});
exports.deleteSkillFromUser = (0, TryCatchHandler_js_1.TryCatchHandler)(async (req, res, next) => {
    const user = req.user;
    if (!user)
        throw new error_js_1.default(401, "Auth required");
    const { skillName } = req.body;
    const { value, error } = user_js_1.SkillNameSchema.validate({
        skillName: skillName
    });
    const skillNameClean = value.skillName.trim().toLowerCase();
    if (error) {
        throw new error_js_1.default(400, `${error.details[0].message}`);
    }
    const result = await (0, db_js_1.sql) `
  DELETE FROM user_skills
  WHERE user_id = ${user.user_id}
  AND skill_id = (
    SELECT skill_id
    FROM skills
    WHERE name = ${skillNameClean}
  ); 
  `;
    console.log(result);
    // if (result.length == 0) {
    //   throw new ErrorHandler(404, `Skill ${skillName.trim()} not found!!`)
    // }
    res.json({
        message: `${value.skillName} deleted successfully!!`,
        success: true,
    });
});
exports.applyForJob = (0, TryCatchHandler_js_1.TryCatchHandler)(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new error_js_1.default(401, "Authentication failed");
    }
    if (user.role !== "jobseeker") {
        throw new error_js_1.default(403, "Forbidden: not allowed to apply");
    }
    if (!user.resume) {
        throw new error_js_1.default(400, "Resume not found. Upload it first");
    }
    const applicant_id = user.user_id;
    const { job_id } = req.body || {};
    const { error } = user_js_1.jobIdSchema.validate({
        job_id
    });
    if (error) {
        throw new error_js_1.default(400, `${error.details[0].message}`);
    }
    const [job] = await (0, db_js_1.sql) `
    SELECT is_active 
    FROM jobs 
    WHERE job_id = ${job_id}
  `;
    if (!job) {
        throw new error_js_1.default(404, "Job not found");
    }
    if (!job.is_active) {
        throw new error_js_1.default(400, "Job is not active");
    }
    const now = Date.now();
    const subtime = user.subscription
        ? new Date(user.subscription).getTime()
        : 0;
    const isSubscribed = subtime > now;
    let newApplication;
    try {
        const result = await (0, db_js_1.sql) `
      INSERT INTO application 
      (job_id, applicant_id, applicant_email, resume, subscribed,status) 
      VALUES (
        ${job_id},
        ${applicant_id},
        ${user.email},
        ${user.resume},
        ${isSubscribed},
        'submitted'
      )
      RETURNING *;
    `;
        newApplication = result[0];
    }
    catch (err) {
        // duplicate application
        if (err.code === "23505") {
            throw new error_js_1.default(409, "You have already applied to this job");
        }
        throw err;
    }
    return res.status(201).json({
        message: "Applied for job successfully",
        application: newApplication,
    });
});
exports.getAllApplication = (0, TryCatchHandler_js_1.TryCatchHandler)(async (req, res, next) => {
    const application = await (0, db_js_1.sql) `
SELECT a.* , j.title AS job_title, j.salary as job_salary, j.location as job_location 
FROM application a JOIN jobs j ON a.job_id = j.job_id WHERE 
a.applicant_id = ${req?.user?.user_id}

`;
    res.json({
        message: 'all application successfull',
        success: true,
        data: application
    });
});
