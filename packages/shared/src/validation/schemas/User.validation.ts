import joi from "joi";
import { LocationSchema } from "./Location.validation";
import { Oauth2IdentifersValidation } from "./Oauth2Identifers.validation";

export const CreateUserValidationSchema = joi.object({
  firstName: joi.string().required().min(3).max(100),
  lastName: joi.string().min(3).max(100),
  password: joi.string().required().min(6),
  phoneNumber: joi
    .string()
    .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/),
  email: joi.string().email(),
  username: joi.string().lowercase().min(3).max(30),
  alias: joi.string().min(3).max(200),
  home: LocationSchema,
  oauth2Identifiers: Oauth2IdentifersValidation,
});

export const UpdateUserValidationSchema = joi.object({
  id: joi.string().required().guid({ version: "uuidv4" }),
  firstName: joi.string().min(3).max(100),
  lastName: joi.string().min(3).max(100),
  password: joi.string().min(6),
  phoneNumber: joi
    .string()
    .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/),
  email: joi.string().email(),
  username: joi.string().lowercase().min(3).max(30),
  alias: joi.string().min(3).max(200),
  home: LocationSchema,
  oauth2Identifiers: Oauth2IdentifersValidation,
});
