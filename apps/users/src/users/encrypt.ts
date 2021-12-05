import * as bcrypt from 'bcrypt';

const encodePassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 6);
};

export default {
  encodePassword,
};
