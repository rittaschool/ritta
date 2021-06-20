import argon2 from 'argon2';
import { UserModel } from '../models';
import {
  decrypt,
  encrypt,
  generateJWT,
  validateOpinsysJWT,
  validateAuthJWT,
} from '../utils';
import { authenticator } from 'otplib';
import base32 from 'thirty-two';
import util from 'util';
import logger from '../logger';

export default class AuthService {
  public static async login(username, password): Promise<any> {
    const userRecord = await UserModel.findOne({ username });
    if (!userRecord) {
      throw new Error('Incorrect username or password');
    } else {
      const passwordCorrect = await argon2.verify(
        decrypt(userRecord.password),
        password
      );
      if (!passwordCorrect) {
        throw new Error('Incorrect username or password');
      }
    }

    if (userRecord.secret) {
      // User uses MFA, add second layer.
      const mfaToken = generateJWT(
        {
          type: 'mfa_required',
          id: userRecord._id,
        },
        '1h'
      );
      return {
        mfaToken,
      };
    }
    const accessToken = generateJWT(
      {
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
      },
      '1h'
    );

    const refreshToken = generateJWT({
      type: 'refresh',
      id: userRecord._id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public static async opinsysAuth(token) {
    const data = validateOpinsysJWT(token);
    const userRecord = await UserModel.findOne({ puavoId: data.puavo_id });
    if (!userRecord) {
      throw new Error('No user found');
    }
    if (userRecord.secret) {
      // User uses MFA, add second layer.
      const mfaToken = generateJWT(
        {
          type: 'mfa_required',
          id: userRecord._id,
        },
        '1h'
      );
      return {
        mfaToken,
      };
    }
    userRecord.latestLogin = Date.now();
    await userRecord.save();
    const accessToken = generateJWT(
      {
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
      },
      '1h'
    );

    const refreshToken = generateJWT({
      type: 'refresh',
      id: userRecord._id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public static async verifyMFA(token, code) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    const totpSecret = decrypt(userRecord.secret);

    if (!authenticator.check(code, totpSecret)) {
      throw new Error('MFA Code invalid');
    }

    userRecord.latestLogin = Date.now();
    await userRecord.save();

    const accessToken = generateJWT(
      {
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
      },
      '1h'
    );

    const refreshToken = generateJWT(
      {
        type: 'refresh',
        id: userRecord._id,
      },
      '90d'
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public static async generateMFA(token) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    const secret = base32
      .encode(authenticator.generateSecret())
      .toString()
      .replace(/=/g, '');
    return {
      secret,
      googleAuthenticator: util.format(
        'otpauth://totp/%s?secret=%s',
        `Ritta - ${userRecord.username}`,
        secret
      ),
    };
  }

  public static async enableMFA(token, secret, code) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    logger.info(code + ' s ' + secret);
    if (!authenticator.check(code, secret)) {
      throw new Error('MFA Code invalid');
    }

    userRecord.secret = encrypt(secret);

    await userRecord.save();

    return {
      success: true,
    };
  }

  public static async refreshToken(token) {
    const data = await validateAuthJWT(token, 'refresh');
    const userRecord = await UserModel.findById(data.id);
    userRecord.latestLogin = Date.now();
    await userRecord.save();
    const accessToken = generateJWT(
      {
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
      },
      '1h'
    );

    const refreshToken = generateJWT(
      {
        type: 'refresh',
        id: userRecord._id,
      },
      '90d'
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
