import * as Joi from 'joi';

export const configSchema = Joi.object({
  DATABASE__HOST: Joi.string().default('localhost'),
  DATABASE__PORT: Joi.number().default(5432),
  DATABASE__USERNAME: Joi.string().required(),
  DATABASE__PASSWORD: Joi.string().required(),
  DATABASE__DATABASE: Joi.string().default('fireart'),
  DATABASE__INSECURE: Joi.boolean().default(false),

  SIGNING__AUTHENTICATION__SECRET: Joi.string().required(),
  SIGNING__AUTHENTICATION__LIFESPAN: Joi.number().default(60 * 60 * 24 * 7),
  SIGNING__PASSWORD_RESET__SECRET: Joi.string().required(),
  SIGNING__ISSUER: Joi.string().default('fireart.longu.dev'),

  SMTP__HOST: Joi.string().default('localhost'),
  SMTP__PORT: Joi.number().default(465),
  SMTP__USERNAME: Joi.string().optional(),
  SMTP__PASSWORD: Joi.string().optional(),
  SMTP__INSECURE: Joi.boolean().default(false),
  SMTP__SENDER: Joi.string().default('contact@fireart.studio'),

  PASSWORD_RESET__LINK_LIFESPAN: Joi.string().default(60 * 60 * 6),
});
