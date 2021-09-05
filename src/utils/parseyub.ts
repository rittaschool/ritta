import yub from 'yubikey-client';
import config from '../config';

type YubiResponse = {
  t: string;
  otp: string;
  nonce: string;
  sl: string;
  status: string;
  signatureVerified: boolean;
  nonceVerified: boolean;
  identity: string;
  serial: number;
  valid: boolean;
};

export default (otp): Promise<YubiResponse> => {
  yub.init(config.yubikey.id, config.yubikey.secret);

  return new Promise((resolve, reject) => {
    yub.verify(otp, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
