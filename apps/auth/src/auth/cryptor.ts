import { compare, hash } from 'bcrypt';

const hashPassword = (password: string) => {
  return hash(password, 15);
};

const verifyPassword = async (password: string, hash: string) => {
  return await compare(password, hash);
};

export default {
  hashPassword,
  verifyPassword,
};
