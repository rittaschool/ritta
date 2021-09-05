import * as dotenv from 'dotenv';

dotenv.config();

export default {
  frontUrl: process.env.FRONT_URL,
  databaseURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  encryptionKey: process.env.ENCRYPTION_KEY,
  fcm: {
    enabled: process.env.FCM_ENABLED === 'true',
    serverKey: process.env.FCM_SERVER_KEY,
  },
  name: process.env.INSTANCE_NAME,
  opinsys: {
    // Opinsys
    enabled: process.env.OPINSYS_ENABLED === 'true',
    organization: process.env.OPINSYS_ORGANIZATION,
    secret: process.env.OPINSYS_SECRET,
  },
  yubikey: {
    enabled: process.env.YUBIKEY_ENABLED === 'true',
    id: process.env.YUBIKEY_ID,
    secret: process.env.YUBIKEY_SECRET,
  },
};
