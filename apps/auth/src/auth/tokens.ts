import { sign, verify } from 'jsonwebtoken';

const signToken = (payload: Record<string, unknown>) => {
  return new Promise((resolve, reject) => {
    sign(payload, process.env.SIGNING_KEY, (err, encoded) => {
      if (err) reject('Invalid token');
      resolve(encoded);
    });
  });
};

const verifyToken = (token: string, secret?: string) => {
  return new Promise((resolve, reject) => {
    verify(token, secret || process.env.SIGNING_KEY, (err, decoded) => {
      if (err) reject('Invalid token');
      resolve(decoded);
    });
  });
};

export default {
  signToken,
  verifyToken,
};
