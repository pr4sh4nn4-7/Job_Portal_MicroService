import axios from "axios";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/error.js";
import { TryCatchHandler } from "../utils/TryCatchHandler.js";
import { companyIdSchema, CreateCompanySchema } from "../validator/company.validator.js";
export const createCompany = TryCatchHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, 'Invalid Auth');
    }
    if (user.role !== 'recruiter') {
        throw new ErrorHandler(403, 'Forbidden request');
    }
    const { name, description, website } = req.body || {};
    const { value, error } = CreateCompanySchema.validate({
        name,
        description,
        website
    });
    if (error) {
        throw new ErrorHandler(400, `${error.details[0].message}`);
    }
    const existingCompany = await sql `
SELECT company_id FROM companies WHERE name=${value.name}
`;
    if (existingCompany.length > 0) {
        throw new ErrorHandler(409, `Company: ${value.name} already exists!!`);
    }
    const file = req.file;
    if (!file) {
        throw new ErrorHandler(400, 'Company logo is required');
    }
    const fileBuffer = await getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        throw new ErrorHandler(500, `Failed to created file buffer`);
    }
    const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/upload`, {
        buffer: fileBuffer.content
    });
    const [newCompany] = await sql `
INSERT INTO companies (name,description,website,logo,logo_public_id, recruiter_id) VALUES 
(
${value.name},${value.description},${value.website},${data.url},${data.public_id},${req.user?.user_id}
)

RETURNING *
`;
    if (!newCompany) {
        throw new ErrorHandler(500, "Company creation failed - no data returned");
    }
    res.json({
        data: newCompany,
        message: "Company created successfully",
        success: true
    });
});
export const deleteCompany = TryCatchHandler(async (req, res, next) => {
    const user = req.user;
    const { companyId } = req.params;
    const { error } = companyIdSchema.validate({
        companyId
    });
    if (error) {
        throw new ErrorHandler(400, `${error.details[0].message}`);
    }
    const [company] = await sql `
SELECT logo_public_id from companies WHERE company_id=${companyId} AND recruiter_id = ${user?.user_id}
`;
    if (!company) {
        throw new ErrorHandler(404, "company not found!! or not authorized!!");
    }
    await sql `
DELETE FROM companies WHERE company_id = ${companyId}
`;
    res.json({
        message: "company have  been deleted successfully",
        success: true
    });
});
export const getAllCompany = TryCatchHandler(async (req, res, next) => {
    const companies = await sql `
SELECT * FROM companies WHERE recruiter_id = ${req.user?.user_id}
`;
    res.json({
        message: "company fetched successfully",
        success: true,
        data: companies
    });
});
export const getCompanyDetails = TryCatchHandler(async (req, res, next) => {
    const { id } = req.params;
    const { error } = companyIdSchema.validate({
        companyId: id
    });
    if (error) {
        throw new ErrorHandler(400, `${error.details[0].message}`);
    }
    const [companyData] = await sql `
SELECT 
    c.*,
    COALESCE(
        (
            SELECT json_agg(j.*)
            FROM jobs j
            WHERE j.company_id = c.company_id
        ),
        '[]'::json
    ) AS jobs
FROM companies c
WHERE c.company_id = ${id};

`;
    if (!companyData) {
        throw new ErrorHandler(404, 'company not found');
    }
    res.json({
        message: `${companyData.name} fetched successfully`,
        data: companyData
    });
});
