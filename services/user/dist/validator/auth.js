"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordSchema = exports.LoginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const libphonenumber_js_1 = require("libphonenumber-js");
exports.registerSchema = joi_1.default.object({
    name: joi_1.default.string().max(44).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.max": "Name cannot exceed 44 characters",
        "any.required": "Name is required"
    }),
    email: joi_1.default.string().email({
        tlds: { allow: ['com', 'net', 'io', 'org'] },
        minDomainSegments: 2,
        allowUnicode: false,
    }).messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be valid and use allowed domains (.com, .net, .io, .org)",
        "string.empty": "Email cannot be empty"
    }),
    password: joi_1.default.string().min(12).required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 12 characters long",
        "any.required": "Password is required"
    }),
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
    role: joi_1.default.string().valid('recruiter', 'jobseeker').messages({
        "any.only": "Role must be either recruiter or jobseeker",
        "string.base": "Role must be a string"
    }),
    bio: joi_1.default.string().when('role', {
        is: 'recruiter',
        then: joi_1.default.optional(),
        otherwise: joi_1.default.required().messages({
            "any.required": "Bio is required when role is jobseeker"
        })
    }).messages({
        "string.base": "Bio must be a string",
        "string.empty": "Bio cannot be empty"
    })
});
exports.LoginSchema = joi_1.default.object({
    email: joi_1.default.string().email({
        tlds: { allow: ['com', 'net', 'io', 'org'] },
        minDomainSegments: 2,
        allowUnicode: false,
    }).messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be valid and use allowed domains (.com, .net, .io, .org)",
        "string.empty": "Email cannot be empty"
    }),
    password: joi_1.default.string().min(12).required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 12 characters long",
        "any.required": "Password is required"
    }),
});
exports.ForgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email({
        tlds: { allow: ['com', 'net', 'io', 'org'] },
        minDomainSegments: 2,
        allowUnicode: false,
    }).messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be valid and use allowed domains (.com, .net, .io, .org)",
        "string.empty": "Email cannot be empty"
    }),
});
