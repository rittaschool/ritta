import * as dotenv from 'dotenv';

dotenv.config();

export default {
  frontUrl: process.env.FRONT_URL,
  databaseURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  encryptionKey: process.env.ENCRYPTION_KEY,
  school: {
    multiSchool: process.env.SCHOOL_MULTISCHOOL,
    name: process.env.SCHOOL_NAME,
    city: process.env.SCHOOL_CITY,
  },
  lang: process.env.LANGUAGE,
  ssl: {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT,
  },
  opinsys: { // Opinsys
    enabled: process.env.OPINSYS_ENABLED,
    organization: process.env.OPINSYS_ORGANIZATION,
    redirectURI: process.env.OPINSYS_REDIRECTURI,
    secret: process.env.OPINSYS_SECRET,
  },
};
