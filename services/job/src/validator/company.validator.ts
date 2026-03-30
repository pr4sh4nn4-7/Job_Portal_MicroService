import Joi from "joi";

export const CreateCompanySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.base": "Company name must be a string",
      "string.empty": "Company name is required",
      "string.min": "Company name must be at least 2 characters long",
      "string.max": "Company name cannot exceed 100 characters",
      "any.required": "Company name is required"
    }),

  description: Joi.string()
    .trim()
    .min(20)
    .max(1000)
    .required()
    .messages({
      "string.base": "Description must be a string",
      "string.empty": "Description is required",
      "string.min": "Description must be at least 20 characters long",
      "string.max": "Description cannot exceed 1000 characters",
      "any.required": "Description is required"
    }),

  website: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .pattern(/^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/)
    .required()
    .messages({
      "string.empty": "Website URL is required",
      "string.uri": "Website must start with http:// or https://",
      "string.pattern.base": "Website must contain a valid domain (e.g., https://company.com)"
    })
});

export const companyIdSchema = Joi.object({
  companyId: Joi.number().integer().required()
}) 
