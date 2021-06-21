import jwt from 'jsonwebtoken';
import config from '../config';
import { UserModel } from '../models';

export const generateJWT = (data, expiration: any = undefined) => {
  const settings = { expiresIn: expiration };
  if (expiration === undefined) {
    delete settings.expiresIn;
  }
  return jwt.sign({ data }, config.jwtSecret, settings);
};

export const validateJWT = (token) => {
  const body = jwt.verify(token, config.jwtSecret);
  return {
    iat: body.iat,
    exp: body.exp,
    ...body.data,
  };
};

export const validateAuthJWT = async (token, type = 'access') => {
  const data = validateJWT(token);
  if (data.type !== type) {
    throw new Error(`Token is not a ${type} token.`);
  }
  const userRecord = await UserModel.findById(data.id);
  if (!userRecord) {
    throw new Error('Token user not found.');
  }
  if (data.iat < userRecord.lastestPasswordChange / 1000) {
    throw new Error('The JWT is expired');
  }
  return data;
};

export const validateOpinsysJWT = (token) => {
  return jwt.verify(token, config.opinsys.secret);
};
