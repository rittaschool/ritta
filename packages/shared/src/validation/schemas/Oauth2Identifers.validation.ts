import joi from "joi";

export const Oauth2IdentifersValidation = joi.object({
  opinsys: joi.string(),
});
