import * as argon2 from 'argon2';

const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password, { saltLength: 16 });
};

const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await argon2.verify(hash, password);
};

export default {
  hashPassword,
  verifyPassword,
};
