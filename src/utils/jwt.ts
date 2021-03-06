import jwt from 'jsonwebtoken';
import config from '../config';
import { UserModel } from '../models';

export const generateJWT = (
  data,
  expiration: any = undefined
): Promise<string> =>
  new Promise((resolve, reject) => {
    const settings = { expiresIn: expiration };
    if (expiration === undefined) {
      delete settings.expiresIn;
    }
    return jwt.sign({ data }, config.jwtSecret, settings, (err, signedJwt) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(signedJwt);
    });
  });

export const validateJWT = (token): Promise<any> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, {}, (err, body) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        iat: body.iat,
        exp: body.exp,
        ...body.data,
      });
    });
  });

export const validateAuthJWT = async (
  token,
  type: string | string[] = 'access'
) => {
  const data = await validateJWT(token);
  if (Array.isArray(type) ? !type.includes(data.type) : data.type !== type) {
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

export const validateOpinsysJWT = (token): Promise<any> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.opinsys.secret, {}, (err, body) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(body);
    });
  });
