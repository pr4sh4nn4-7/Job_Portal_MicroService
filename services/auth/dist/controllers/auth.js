import { TryCatchHandler } from "../utils/TryCatchHandler.js";
import { ForgotPasswordSchema, LoginSchema, registerSchema } from "../validator/auth.js";
import ErrorHandler from "../utils/error.js";
import { sql } from "../utils/db.js";
import bcrypt from 'bcrypt';
import getBuffer from "../utils/buffer.js";
import axios from 'axios';
import { gen_verfification_code } from "../utils/verify.code.js";
import { MailSender } from "../utils/nodemailer.js";
import { Jwt_Token_Generator } from "../utils/genreate.token.js";
import jwt from 'jsonwebtoken';
import { forgotPasswordTemplate } from "../template.js";
import { publishToTopic } from "../producer.js";
import { redisClient } from "../index.js";
export const registerUser = TryCatchHandler(async (req, res, next) => {
    let { name, email, password, phone_number, role, bio } = req.body;
    const { value, error } = registerSchema.validate({
        name,
        email,
        password,
        role,
        bio,
        phone_number
    });
    if (error) {
        throw new ErrorHandler(400, `${error.details[0].message}`);
    }
    const existingUser = await sql `
SELECT user_id from users WHERE email = ${value.email}
`;
    if (existingUser.length > 0) {
        throw new ErrorHandler(400, "User already exists!!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let registerUser;
    // generate verification code 
    const code = gen_verfification_code();
    await MailSender({ to: value.email, code });
    if (role === 'recruiter') {
        const [user] = await sql `
    INSERT INTO users (name,email,password,phone_number,role,verification_code) values 
(${value.name},${value.email},${hashedPassword},${value.phone_number},${value.role},${code}) RETURNING user_id,name,email,role,phone_number,created_at
    `;
        registerUser = user;
        return res.status(200).json({
            message: "Verification code sent",
            user: user,
        });
    }
    else if (role === 'jobseeker') {
        const file = req.file;
        if (!file) {
            throw new ErrorHandler(400, "Resume is required!");
        }
        console.log(value);
        const fileBuffer = await getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            throw new ErrorHandler(500, "Failed to generate buffer");
        }
        const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/upload`, {
            buffer: fileBuffer.content
        });
        const [user] = await sql `
      INSERT INTO users (name,email,password,phone_number,role,bio,resume,resume_public_id) values (${value.name},${value.email},${hashedPassword},${value.phone_number},${value.role},${value.bio},${data.url},${data.public_id}) RETURNING user_id,name,email,role,bio,resume,phone_number,created_at`;
        const token = Jwt_Token_Generator(user.email, user.role);
        res.json({
            user,
            message: "Registered successfully",
            token,
            success: true
        });
    }
});
// login
export const Login = TryCatchHandler(async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        throw new ErrorHandler(400, "All fields required");
    }
    const { email, password } = req.body || {};
    const { value, error } = LoginSchema.validate({
        email,
        password
    });
    if (error) {
        throw new ErrorHandler(400, `${error.details[0].message}`);
    }
    const user = await sql `
SELECT u.user_id,u.name,u.email, u.password, u.phone_number, u.role, u.bio,u.resume,u.profile_pic,u.subscription, ARRAY_AGG(s.name) 
FILTER (WHERE s.name IS NOT NULL) as skills FROM users u 
LEFT JOIN user_skills us on u.user_id=us.user_id
LEFT JOIN skills s ON us.skill_id = s.skill_id 
WHERE u.email = ${value.email} GROUP BY u.user_id;
`;
    if (user.length === 0) {
        throw new ErrorHandler(400, "Invalid email or password!!");
    }
    const userObject = user[0];
    const matchPassword = await bcrypt.compare(value.password, userObject.password);
    if (!matchPassword) {
        throw new ErrorHandler(400, 'Invalid email or password!!');
    }
    userObject.skills = userObject.sills || [];
    delete userObject.password;
    const token = Jwt_Token_Generator(userObject.email, userObject.role);
    res.json({
        user: userObject,
        message: "Usor Logged in successfully!!",
        token,
        success: true
    });
});
// forgot password
export const forgotPassword = TryCatchHandler(async (req, res, next) => {
    const { email } = req.body;
    const { value, error } = ForgotPasswordSchema.validate({
        email
    });
    if (error) {
        throw new ErrorHandler(400, `${error.details[0].message}`);
    }
    const users = await sql `
SELECT user_id,email FROM users WHERE email = ${email}
`;
    if (users.length === 0) {
        return res.json({
            message: `If your email is registered with us, you will receive a password reset link shortly. 
Please check your inbox and spam folder.`,
            success: true
        });
    }
    const user = users[0];
    const resetToken = jwt.sign({
        email: user.email, type: "reset"
    }, process.env.JWT_RESET_SECRET, {
        expiresIn: '10m'
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
    await redisClient.set(`forgot:${email}`, resetToken, {
        EX: 6000
    });
    const message = {
        to: email,
        subject: "Reset Password - PCareer",
        html: forgotPasswordTemplate(resetToken)
    };
    publishToTopic('send-mail', message).catch((err) => console.log(`failed to send email`, err));
    res.json({
        message: `If your email is registered with us, you will receive a password reset link shortly. 
Please check your inbox and spam folder.`,
        success: true
    });
});
// reset password
export const resetPassword = TryCatchHandler(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body || {};
    if (!password) {
        throw new ErrorHandler(400, 'All field required');
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        console.log(decoded.type);
        if (decoded.type != 'reset') {
            throw new ErrorHandler(400, "Invalid token");
        }
        const email = decoded.email;
        const storedToken = await redisClient.get(`forgot:${email}`);
        if (!storedToken || storedToken !== token) {
            throw new ErrorHandler(400, "Token has been expired");
        }
        const users = await sql `
SELECT user_id FROM users WHERE email=${email}
`;
        if (users.length === 0) {
            throw new ErrorHandler(404, "User not found");
        }
        const user = users[0];
        const hashedPassword = await bcrypt.hash(password, 10);
        await sql `
UPDATE users SET password =${hashedPassword} where user_id =${user.user_id}
`;
        await redisClient.del(`forgot:${email}`);
        res.json({
            message: "Password updated successfully!!",
            success: true
        });
    }
    catch (err) {
        console.log("reset password error", err);
        throw new ErrorHandler(400, "Invalid token" + err);
    }
});
