import joi from "joi";

export const LocationSchema = joi.object({
  address: joi.string().required(),
  city: joi.string().required(),
  country: joi.string().required(),
  zip: joi.string().required(),
});
