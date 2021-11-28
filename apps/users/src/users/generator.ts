import { IBackupCode } from '@rittaschool/shared';

const generateBackupCode = async (): Promise<IBackupCode> => {
  return {
    code:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
    used: false,
  };
};

const generateMFASecret = async (): Promise<string> => {
  return Math.random().toString(36).substring(2, 15);
};

export default {
  generateBackupCode,
  generateMFASecret,
};
