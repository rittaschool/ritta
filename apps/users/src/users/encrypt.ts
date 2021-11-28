import * as argon2 from 'argon2';

const encodePassword = async (password: string): Promise<string> => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
  });
};

export default {
  encodePassword,
};
