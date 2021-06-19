import jwt from 'jsonwebtoken';
import config from '../config';

export const generateJWT = (data, expiration: any = undefined) => {
  const settings = { expiresIn: expiration };
  if (expiration === undefined) {
    delete settings.expiresIn;
  }
  try {
    return jwt.sign({ data, }, config.jwtSecret, settings);
  } catch(e) {
    throw e;
  }
}

export const validateJWT = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch(e) {
    throw e;
  }
}
