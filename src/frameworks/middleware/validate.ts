import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { BadRequestError } from '../../shared/error';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      throw new BadRequestError(errorMessage);
    }
    next();
  };
};

export const signupSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  bandName: Joi.string().allow('', null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const bookingSchema = Joi.object({
  date: Joi.string().isoDate().required(),
  slotId: Joi.string().required(),
  slotLabel: Joi.string().required(),
  bandName: Joi.string().required(),
  purpose: Joi.string().required(),
});
