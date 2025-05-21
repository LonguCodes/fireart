import * as Joi from 'joi';

export const configSchema = Joi.object({
  DATABASE__HOST: Joi.string().default('localhost'),
  DATABASE__PORT: Joi.number().default(5432),
  DATABASE__USERNAME: Joi.string().required(),
  DATABASE__PASSWORD: Joi.string().required(),
  DATABASE__DATABASE: Joi.string().default('fireart'),
  DATABASE__INSECURE: Joi.boolean().default(false),

  SIGNING__AUTHENTICATION: Joi.string().required(),
  SIGNING__PASSWORD_RESET: Joi.string().required(),

  SMTP__HOST: Joi.string().default('localhost'),
  SMTP__PORT: Joi.number().default(465),
  SMTP__USERNAME: Joi.string().optional(),
  SMTP__PASSWORD: Joi.string().optional(),
  SMTP__INSECURE: Joi.boolean().default(false),
  SMTP__FROM: Joi.string().default('contact@fireart.studio')
});
