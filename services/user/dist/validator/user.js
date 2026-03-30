"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobIdSchema = exports.userIdSchema = exports.SkillNameSchema = exports.profileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const libphonenumber_js_1 = require("libphonenumber-js");
exports.profileSchema = joi_1.default.object({
    name: joi_1.default.string(),
    phone_number: joi_1.default.string().custom((value, helpers) => {
        const phone = (0, libphonenumber_js_1.parsePhoneNumberFromString)(value);
        if (!phone || !phone.isValid()) {
            return helpers.error("phone.invalid");
        }
        return value;
    }).messages({
        "string.base": "Phone number must be a string",
        "phone.invalid": "Phone number is invalid"
    }),
    bio: joi_1.default.string().messages({
        "string.base": "Bio must be a string",
        "string.empty": "Bio cannot be empty"
    })
});
exports.SkillNameSchema = joi_1.default.object({
    skillName: joi_1.default.string()
        .pattern(/^[A-Z][a-z]+$/).required().trim().messages({
        'string.pattern.base': 'Code must start with one uppercase letter followed by lowercase letters (e.g., "Abc")',
    })
});
exports.userIdSchema = joi_1.default.object({
    userId: joi_1.default.number().integer().required()
});
exports.jobIdSchema = joi_1.default.object({
    job_id: joi_1.default.number().integer().required()
});
