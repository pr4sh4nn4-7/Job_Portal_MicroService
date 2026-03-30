import Joi from 'joi';
export const jobSchema = Joi.object({
    title: Joi.string()
        .max(244)
        .required()
        .messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title is required',
        'string.max': 'Title cannot exceed 244 characters',
        'any.required': 'Title is required'
    }),
    description: Joi.string()
        .required()
        .messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description is required',
        'any.required': 'Description is required'
    }),
    salary: Joi.number()
        .precision(2)
        .min(0)
        .optional()
        .messages({
        'number.base': 'Salary must be a number',
        'number.min': 'Salary cannot be negative',
        'number.precision': 'Salary can have at most 2 decimal places'
    }),
    location: Joi.string()
        .max(255)
        .optional()
        .messages({
        'string.base': 'Location must be a string',
        'string.max': 'Location cannot exceed 255 characters'
    }),
    job_type: Joi.string()
        .valid('full-time', 'part-time', 'contract', 'internship')
        .required()
        .messages({
        'any.only': 'Job type must be one of full-time, part-time, contract, internship',
        'string.empty': 'Job type is required',
        'any.required': 'Job type is required'
    }),
    openings: Joi.number()
        .precision(1)
        .min(0)
        .max(999)
        .required()
        .messages({
        'number.base': 'Openings must be a number',
        'number.min': 'Openings cannot be negative',
        'number.max': 'Openings cannot exceed 999',
        'number.precision': 'Openings can have at most 1 decimal place',
        'any.required': 'Openings is required'
    }),
    role: Joi.string()
        .max(255)
        .required()
        .messages({
        'string.base': 'Role must be a string',
        'string.empty': 'Role is required',
        'string.max': 'Role cannot exceed 255 characters',
        'any.required': 'Role is required'
    }),
    work_location: Joi.string()
        .valid('remote', 'onsite', 'hybrid')
        .required()
        .messages({
        'any.only': 'Work location must be one of remote, onsite, hybrid',
        'string.empty': 'Work location is required',
        'any.required': 'Work location is required'
    }),
    company_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
        'number.base': 'Company ID must be a number',
        'number.integer': 'Company ID must be an integer',
        'number.positive': 'Company ID must be a positive number',
        'any.required': 'Company ID is required'
    })
});
export const updateSchema = jobSchema.concat(Joi.object({
    is_active: Joi.boolean().required().truthy('true', 1).falsy('false', 0)
}));
export const jobIdSchema = Joi.object({
    jobId: Joi.number().integer().required()
});
export const filterJobSchema = Joi.object({
    title: Joi.string()
        .max(244)
        .optional()
        .allow('')
        .messages({
        'string.base': 'Title must be a string',
        'string.max': 'Title cannot exceed 244 characters',
    }),
    location: Joi.string()
        .max(255)
        .optional()
        .allow('')
        .messages({
        'string.base': 'Location must be a string',
        'string.max': 'Location cannot exceed 255 characters'
    }),
});
