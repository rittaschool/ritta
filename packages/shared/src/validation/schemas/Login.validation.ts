import joi from "joi";
import { ISocialProvider } from "../..";

export const LoginValidationSchema = joi.object({
  username: joi.alternatives().try(
    joi.string().email(),
    joi.string().lowercase().min(3).max(30)
  ).required(),
  password: joi.string().required(),
});

export const LoginMFAValidationSchema = joi.object({
  mfaToken: joi.string().required(),
  mfaCode: joi.string().length(6).regex(/^\d+$/).required(),
});

export const LoginOAuthValidationSchema = joi.object({
  provider: joi.string().valid(ISocialProvider).required(),
  identifier: joi.string().required()
});

