import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const companySchema = Joi.object({
  name: Joi.string().trim().required().min(2).max(255).messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters'
  }),
  location: Joi.string().trim().allow('', null).optional(),
  description: Joi.string().trim().allow('', null).optional()
});

export const categorySchema = Joi.object({
  name: Joi.string().required().min(2)
});

export const jobSchema = Joi.object({
  company_id: Joi.string().uuid().required(),
  category_id: Joi.string().uuid().required(),
  title: Joi.string().required().min(5),
  description: Joi.string().allow('', null).optional(),
  job_type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').optional(),
  experience_level: Joi.string().valid('entry', 'mid', 'senior', 'lead').optional(),
  location_type: Joi.string().valid('remote', 'onsite', 'hybrid').optional(),
  location_city: Joi.string().allow('', null).optional(),
  salary_min: Joi.number().integer().min(0).optional(),
  salary_max: Joi.number().integer().min(0).optional(),
  is_salary_visible: Joi.boolean().optional(),
  status: Joi.string().valid('open', 'close').optional()
});

export const applicationSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  job_id: Joi.string().uuid().required(),
  status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending')
});

export const applicationStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected').required()
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: 'failed', message: error.details[0].message });
  }
  next();
};