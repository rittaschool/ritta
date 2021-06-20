import jwt from 'jsonwebtoken';
import config from '../config';

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

export const validateOpinsysJWT = (token) => {
  return jwt.verify(token, config.opinsys.secret);
};
