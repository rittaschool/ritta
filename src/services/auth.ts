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
import crypto from 'crypto';

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
      const mfaToken = await generateJWT(
        {
          type: 'mfa_required',
          id: userRecord._id,
        },
        600
      );
      return {
        mfaToken,
      };
    }

    userRecord.latestLogin = Date.now();
    await userRecord.save();

    if (userRecord.passwordChangeRequired) {
      const passwordChangeToken = await generateJWT(
        {
          type: 'passwordchange_required',
          id: userRecord._id,
        },
        '1h'
      );
      return {
        passwordChangeToken,
      };
    }

    const accessToken = await generateJWT(
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

    const refreshToken = await generateJWT({
      type: 'refresh',
      id: userRecord._id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public static async opinsysAuth(token) {
    const data = await validateOpinsysJWT(token);
    const userRecord = await UserModel.findOne({ puavoId: data.puavo_id });
    if (!userRecord) {
      throw new Error('No user found');
    }
    if (userRecord.secret) {
      // User uses MFA, add second layer.
      const mfaToken = await generateJWT(
        {
          type: 'mfa_required',
          id: userRecord._id,
        },
        600
      );
      return {
        mfaToken,
      };
    }

    userRecord.latestLogin = Date.now();
    await userRecord.save();

    if (userRecord.passwordChangeRequired) {
      const passwordChangeToken = await generateJWT(
        {
          type: 'passwordchange_required',
          id: userRecord._id,
        },
        '1h'
      );
      return {
        passwordChangeToken,
      };
    }

    const accessToken = await generateJWT(
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

    const refreshToken = await generateJWT({
      type: 'refresh',
      id: userRecord._id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public static async verifyMFA(token, code) {
    const data = await validateAuthJWT(token, 'mfa_required');
    const userRecord = await UserModel.findById(data.id);
    const totpSecret = decrypt(userRecord.secret);

    if (
      !authenticator.check(code, totpSecret) &&
      code !== userRecord.mfaBackup
    ) {
      throw new Error('MFA Code invalid');
    }

    userRecord.latestLogin = Date.now();
    await userRecord.save();

    if (userRecord.passwordChangeRequired) {
      const passwordChangeToken = await generateJWT(
        {
          type: 'passwordchange_required',
          id: userRecord._id,
        },
        '1h'
      );
      return {
        passwordChangeToken,
      };
    }

    const accessToken = await generateJWT(
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

    const refreshToken = await generateJWT(
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
    if (userRecord.secret) {
      throw new Error('MFA already enabled');
    }
    const secret = base32
      .encode(authenticator.generateSecret())
      .toString()
      .replace(/=/g, '');
    const backupCode = crypto.randomBytes(4).toString('hex');
    userRecord.mfaBackup = backupCode;
    await userRecord.save();
    return {
      secret,
      googleAuthenticator: util.format(
        'otpauth://totp/%s?secret=%s',
        `Ritta - ${userRecord.username}`,
        secret
      ),
      backupCode,
    };
  }

  public static async enableMFA(token, secret, code) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (userRecord.secret) {
      throw new Error('MFA already enabled');
    }
    if (!authenticator.check(code, secret)) {
      throw new Error('MFA Code invalid');
    }

    userRecord.secret = encrypt(secret);
    userRecord.lastestPasswordChange = Date.now();
    await userRecord.save();

    return {
      success: true,
    };
  }

  public static async disableMFA(token, secret, code) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.secret) {
      throw new Error('MFA not enabled');
    }
    if (!authenticator.check(code, secret) && code !== userRecord.mfaBackup) {
      throw new Error('MFA Code invalid');
    }

    userRecord.secret = undefined;
    userRecord.mfaBackup = undefined;
    userRecord.lastestPasswordChange = Date.now();
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
    const accessToken = await generateJWT(
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

    const refreshToken = await generateJWT(
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
