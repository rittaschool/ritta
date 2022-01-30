import crypto from 'crypto';

const hashPassword = (password: string) => {
  return crypto.createHash('sha512').update(password).digest('hex');
};

const verifyPassword = async (password: string, hash: string) => {
  return hashPassword(password) === hash;
};

export default {
  hashPassword,
  verifyPassword,
};
