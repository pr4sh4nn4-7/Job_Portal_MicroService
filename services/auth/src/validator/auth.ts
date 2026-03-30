import Joi, { allow } from 'joi'
import { parsePhoneNumberFromString } from 'libphonenumber-js';


export const registerSchema = Joi.object({
  name: Joi.string().max(44).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.max": "Name cannot exceed 44 characters",
    "any.required": "Name is required"
  }),

  email: Joi.string().email({
    tlds: { allow: ['com', 'net', 'io', 'org'] },
    minDomainSegments: 2,
    allowUnicode: false,
  }).messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be valid and use allowed domains (.com, .net, .io, .org)",
    "string.empty": "Email cannot be empty"
  }),

  password: Joi.string().min(12).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 12 characters long",
    "any.required": "Password is required"
  }),

  phone_number: Joi.string().custom((value, helpers) => {
    const phone = parsePhoneNumberFromString(value);
    if (!phone || !phone.isValid()) {
      return helpers.error("phone.invalid");
    }
    return value;
  }).messages({
    "string.base": "Phone number must be a string",
    "phone.invalid": "Phone number is invalid"
  }),

  role: Joi.string().valid('recruiter', 'jobseeker').messages({
    "any.only": "Role must be either recruiter or jobseeker",
    "string.base": "Role must be a string"
  }),

  bio: Joi.string().when('role', {
    is: 'recruiter',
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      "any.required": "Bio is required when role is jobseeker"
    })
  }).messages({
    "string.base": "Bio must be a string",
    "string.empty": "Bio cannot be empty"
  })
});


export const LoginSchema = Joi.object({

  email: Joi.string().email({
    tlds: { allow: ['com', 'net', 'io', 'org'] },
    minDomainSegments: 2,
    allowUnicode: false,
  }).messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be valid and use allowed domains (.com, .net, .io, .org)",
    "string.empty": "Email cannot be empty"
  }),

  password: Joi.string().min(12).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 12 characters long",
    "any.required": "Password is required"
  }),
})

export const ForgotPasswordSchema = Joi.object({

  email: Joi.string().email({
    tlds: { allow: ['com', 'net', 'io', 'org'] },
    minDomainSegments: 2,
    allowUnicode: false,
  }).messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be valid and use allowed domains (.com, .net, .io, .org)",
    "string.empty": "Email cannot be empty"
  }),

})
