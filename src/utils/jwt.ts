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
    const body = jwt.verify(token, config.jwtSecret);
    return {
      iat: jwt.iat,
      exp: jwt.exp,
      ...body.data,
    }
  } catch(e) {
    throw e;
  }
}

export const validateOpinsysJWT = (token) => {
  try {
    return jwt.verify(token, config.opinsys.secret);
  } catch(e) {
    throw e;
  }
}
