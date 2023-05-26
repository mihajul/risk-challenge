import { validate, Joi } from 'express-validation';

export const riskRequestValidator = validate(
  {
    body: Joi.object({
      age: Joi.number().required().min(0),
      dependents: Joi.number().required().min(0),
      house: Joi.object({
        ownership_status: Joi.string().valid('owned', 'mortgaged').required(),
      }).allow(null),
      income: Joi.number().required().min(0),
      marital_status: Joi.string().valid('single', 'married').required(),
      risk_questions: Joi.array().items(Joi.number().integer().valid(0, 1)).length(3).required(),
      vehicle: Joi.object({
        year: Joi.number().integer().positive().required(),
      }).allow(null),
    }),
  },
  {}
);
