import argon2 from 'argon2';
import { UserModel } from '../models';
import { decrypt, encrypt, generateJWT, validateJWT, validateOpinsysJWT } from '../utils';
import { authenticator } from 'otplib';
import base32 from 'thirty-two';
import util from 'util';
import logger from '../logger';

export default class AuthService {

  public static async login(username, password): Promise<any> {
    const userRecord = await UserModel.findOne({ username });
    if (!userRecord) {
      throw new Error('Incorrect username or password')
    } else {
      const passwordCorrect = await argon2.verify(decrypt(userRecord.password), password);
      if (!passwordCorrect) {
        throw new Error('Incorrect username or password')
      }
    }

    try {
      if (userRecord.secret) {
        // User uses MFA, add second layer.
        const mfaToken = generateJWT({
          type: 'mfa_required',
          id: userRecord._id,
        }, '1h');
        return {
          mfaToken
        }
      }
      const accessToken = generateJWT({
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
      }, '1h');

      const refreshToken = generateJWT({
        type: 'refresh',
        id: userRecord._id
      });

      return {
        accessToken,
        refreshToken
      }
    } catch(err) {
      throw err;
    }
  }

  public static async opinsysAuth(token) {
    const data = validateOpinsysJWT(token);
    const userRecord = await UserModel.findOne({ puavoId: data.puavo_id });
    if (!userRecord) {
      throw new Error('No user found')
    }
    try {
      if (userRecord.secret) {
        // User uses MFA, add second layer.
        const mfaToken = generateJWT({
          type: 'mfa_required',
          id: userRecord._id,
        }, '1h');
        return {
          mfaToken
        }
      }
      userRecord.latestLogin = Date.now();
      await userRecord.save();
      const accessToken = generateJWT({
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
      }, '1h');

      const refreshToken = generateJWT({
        type: 'refresh',
        id: userRecord._id
      });

      return {
        accessToken,
        refreshToken
      }
    } catch(err) {
      throw err;
    }
  }

  public static async verifyMFA(token, code) {
    try {
      const data = validateJWT(token);
      if (data.type !== 'mfa_required') {
        throw new Error('Token is not a mfa_required token.')
      }
      const userRecord = await UserModel.findById(data.id);
      if (!userRecord) {
        throw new Error('Token user not found.')
      }
      if (!userRecord.secret) {
        throw new Error('Token user does not use MFA');
      }
      if (data.iat < (userRecord.lastestPasswordChange / 1000)) {
        throw new Error('The JWT is expired')
      }
      const totpSecret = decrypt(userRecord.secret);
    
      if (!authenticator.check(code, totpSecret)) {
        throw new Error('MFA Code invalid')
      }
      
      userRecord.latestLogin = Date.now();
      await userRecord.save();

      const accessToken = generateJWT({
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
      }, '1h');

      const refreshToken = generateJWT({
        type: 'refresh',
        id: userRecord._id
      }, '90d');

      return {
        accessToken,
        refreshToken
      }
    } catch (err) {
      throw err;
    }
  }

  public static async generateMFA(token) {
    try {
      const data = validateJWT(token);
      if (data.type !== 'access') {
        throw new Error('Token is not a access token.')
      }
      const userRecord = await UserModel.findById(data.id);
      if (!userRecord) {
        throw new Error('Token user not found.')
      }
      if (userRecord.secret) {
        throw new Error('Token user has MFA already enabled.')
      }
      if (data.iat < (userRecord.lastestPasswordChange / 1000)) {
        throw new Error('The JWT is expired')
      }
      const secret = base32.encode(authenticator.generateSecret()).toString().replace(/=/g, '');
      return {
        secret,
        googleAuthenticator: util.format('otpauth://totp/%s?secret=%s', `Ritta - ${userRecord.username}`, secret)
      }
    } catch (err) {
      throw err;
    }
  }

  public static async enableMFA(token, secret, code) {
    try {
      const data = validateJWT(token);
      if (data.type !== 'access') {
        throw new Error('Token is not a access token.')
      }
      const userRecord = await UserModel.findById(data.id);
      if (!userRecord) {
        throw new Error('Token user not found.')
      }
      if (userRecord.secret) {
        throw new Error('Token user has MFA already enabled.')
      }
      if (data.iat < (userRecord.lastestPasswordChange / 1000)) {
        throw new Error('The JWT is expired')
      }
      logger.info(code + ' s ' + secret)
      if (!authenticator.check(code, secret)) {
        throw new Error('MFA Code invalid')
      }

      userRecord.secret = encrypt(secret);

      await userRecord.save();

      return {
        success: true
      }
    } catch (err) {
      throw err;
    }
  }

  public static async refreshToken(token) {
    try {
      const data = validateJWT(token);
      if (data.type !== 'refresh') {
        throw new Error('Token is not a refresh token.')
      }
      const userRecord = await UserModel.findById(data.id);
      if (!userRecord) {
        throw new Error('Token user not found.')
      }
      if (data.iat < (userRecord.lastestPasswordChange / 1000)) {
        throw new Error('The JWT is expired')
      }
      userRecord.latestLogin = Date.now();
      await userRecord.save();
      const accessToken = generateJWT({
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
      }, '1h');

      const refreshToken = generateJWT({
        type: 'refresh',
        id: userRecord._id
      }, '90d');

      return {
        accessToken,
        refreshToken
      }
    } catch (err) {
      throw err;
    }
  }
}