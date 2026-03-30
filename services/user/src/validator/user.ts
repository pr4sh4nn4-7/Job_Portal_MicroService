import Joi from 'joi'
import { parsePhoneNumberFromString } from 'libphonenumber-js';


export const profileSchema = Joi.object({
  name: Joi.string(),

  phone_number: Joi.string().custom((value, helpers) => {
    const phone = parsePhoneNumberFromString(value)
    if (!phone || !phone.isValid()) {
      return helpers.error("phone.invalid")
    }
    return value
  }).messages({
    "string.base": "Phone number must be a string",
    "phone.invalid": "Phone number is invalid"
  }),

  bio: Joi.string().messages({
    "string.base": "Bio must be a string",
    "string.empty": "Bio cannot be empty"
  })
})


export const SkillNameSchema = Joi.object({
  skillName: Joi.string()
    .pattern(/^[A-Z][a-z]+$/).required().trim().messages({
      'string.pattern.base': 'Code must start with one uppercase letter followed by lowercase letters (e.g., "Abc")',
    })
});


export const userIdSchema = Joi.object({
  userId: Joi.number().integer().required()
})

export const jobIdSchema = Joi.object({
  job_id: Joi.number().integer().required()
}) 
