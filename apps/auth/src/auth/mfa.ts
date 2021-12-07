import { totp } from 'otplib';

const checkMfaCode = (code: string, userSecret: string): boolean => {
  return totp.check(code, userSecret);
};

export default {
  checkMfaCode,
};
