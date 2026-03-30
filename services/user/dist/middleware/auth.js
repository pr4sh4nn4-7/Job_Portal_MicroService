"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const db_js_1 = require("../utils/db.js");
const error_js_1 = __importDefault(require("../utils/error.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new error_js_1.default(401, "Invalid auth");
        }
        const token = authHeader.split(" ")[1];
        const decodedPayload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decodedPayload || !decodedPayload.email) {
            throw new error_js_1.default(401, "Invalid auth");
        }
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
      WHERE u.email = ${decodedPayload.email}
      GROUP BY u.user_id
    `;
        if (users.length === 0) {
            throw new error_js_1.default(401, "Invalid auth");
        }
        const user = users[0];
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.isAuth = isAuth;
