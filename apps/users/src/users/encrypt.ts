import crypto from 'crypto';

const encodePassword = async (password: string): Promise<string> => {
  return crypto.createHash('sha512').update(password).digest('hex');
};

export default {
  encodePassword,
};
