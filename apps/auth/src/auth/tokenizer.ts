import { IErrorType, RittaError } from '@rittaschool/shared';
import { sign, verify } from 'jsonwebtoken';

const signToken = (payload: Record<string, unknown>) => {
  return new Promise((resolve, reject) => {
    sign(payload, process.env.SIGNING_KEY, (err, encoded) => {
      if (err)
        reject(new RittaError('Invalid token', IErrorType.INVALID_TOKEN));
      resolve(encoded);
    });
  });
};

const verifyToken = (token: string, secret?: string) => {
  return new Promise((resolve, reject) => {
    verify(token, secret || process.env.SIGNING_KEY, (err, decoded) => {
      if (err)
        reject(new RittaError('Invalid token', IErrorType.INVALID_TOKEN));
      resolve(decoded);
    });
  });
};

export default {
  signToken,
  verifyToken,
};
