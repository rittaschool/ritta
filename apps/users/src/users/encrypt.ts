import * as argon2 from 'argon2';

const encodePassword = async (password: string): Promise<string> => {
  console.log('hashing'); // TODO: remove debug
  console.log(await argon2.hash(password, { saltLength: 8, timeCost: 3 })); // TODO: remove debug
  return await argon2.hash(password, { saltLength: 16, timeCost: 3 });
};

export default {
  encodePassword,
};
