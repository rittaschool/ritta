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
import parseyub from '../utils/parseyub';
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

  public static async yubiAuth(otp, pin) {
    const data = await parseyub(otp);
    if (!data.valid) {
      throw new Error('The OTP is not valid');
    }
    if (!data.identity) {
      throw new Error('Identity missing');
    }
    const userRecord = await UserModel.findOne({ yubikeyId: data.identity });
    if (!userRecord) {
      throw new Error('No user found');
    }
    if (!userRecord.yubiPIN || userRecord.yubiPIN !== pin) {
      throw new Error('PIN is incorrect');
    }
    // Yubikey can skip MFA, as it with a PIN is pretty secure.

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
      !userRecord.mfaBackup.includes(code)
    ) {
      throw new Error('MFA Code invalid');
    }

    if (userRecord.mfaBackup.includes(code)) {
      userRecord.mfaBackup = userRecord.mfaBackup.filter(
        (backupCode) => backupCode !== code
      );
      if (userRecord.mfaBackup.length === 0) {
        userRecord.mfaBackup = [
          crypto.randomBytes(6).toString('hex'),
          crypto.randomBytes(6).toString('hex'),
          crypto.randomBytes(6).toString('hex'),
          crypto.randomBytes(6).toString('hex'),
          crypto.randomBytes(6).toString('hex'),
          crypto.randomBytes(6).toString('hex'),
        ];
      }
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
    const backupCodes = [
      crypto.randomBytes(6).toString('hex'),
      crypto.randomBytes(6).toString('hex'),
      crypto.randomBytes(6).toString('hex'),
      crypto.randomBytes(6).toString('hex'),
      crypto.randomBytes(6).toString('hex'),
      crypto.randomBytes(6).toString('hex'),
    ];
    userRecord.mfaBackup = backupCodes;
    await userRecord.save();
    return {
      secret,
      googleAuthenticator: util.format(
        'otpauth://totp/%s?secret=%s',
        `Ritta - ${userRecord.username}`,
        secret
      ),
      backupCodes,
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
    userRecord.latestPasswordChange = Date.now();
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
    if (
      !authenticator.check(code, secret) &&
      !userRecord.mfaBackup.includes(code)
    ) {
      throw new Error('MFA Code invalid');
    }

    userRecord.secret = undefined;
    userRecord.mfaBackup = undefined;
    userRecord.latestPasswordChange = Date.now();
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
