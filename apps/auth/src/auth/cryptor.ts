import bcrypt from 'bcrypt';

const hashPassword = (password: string) => {
  return bcrypt.hash(password, 15);
};

const verifyPassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export default {
  hashPassword,
  verifyPassword,
};
