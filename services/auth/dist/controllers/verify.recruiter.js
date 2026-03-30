import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/error.js";
import { TryCatchHandler } from "../utils/TryCatchHandler.js";
export const Verify_Recruiter = TryCatchHandler(async (req, res, next) => {
    const { verify_otp, user_id } = req.body || {};
    console.log(verify_otp, user_id);
    if (!verify_otp || !user_id) {
        throw new ErrorHandler(404, "verify_otp is required");
    }
    const data = await sql `
select verification_code,user_id,created_at,role from users WHERE user_id=${user_id};
`;
    if (data.length === 0) {
        throw new ErrorHandler(404, "Invalid user_id or otps");
    }
    switch (data[0].role) {
        case "jobseeker": {
            throw new ErrorHandler(401, "Malicious action found!!");
        }
        case "recruiter": {
            if (verify_otp != data[0].verification_code || data[0].user_id != user_id) {
                throw new ErrorHandler(400, "Invalid user_id or otp");
            }
            else {
                await sql `
  UPDATE  users SET verified=true WHERE user_id=${user_id}
  `;
                res.status(200).json({
                    message: "registration and verification  successfull",
                    success: true
                });
            }
        }
    }
});
