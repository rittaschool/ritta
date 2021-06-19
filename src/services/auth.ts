import argon2 from 'argon2';
import { UserModel } from '../models';
import { decrypt, generateJWT, validateJWT } from '../utils';
import notp from 'notp';
import base32 from 'thirty-two';
import crypto from 'crypto';
import util from 'util';

export default class AuthService {

  public static async login(username, password): Promise<any> {
    const userRecord = await UserModel.findOne({ username });
    if (!userRecord) {
      throw new Error('User not found')
    } else {
      const passwordCorrect = await argon2.verify(userRecord.password, password);
      if (!passwordCorrect) {
        throw new Error('Incorrect password')
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
        passwordChangeRequired: userRecord.passwordChangeRequired
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
    
      if (!notp.totp.verify(code, totpSecret)) {
        throw new Error('MFA Code invalid')
      }
      
      const accessToken = generateJWT({
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
        passwordChangeRequired: userRecord.passwordChangeRequired
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
      if (data.type !== 'mfa_required') {
        throw new Error('Token is not a mfa_required token.')
      }
      const userRecord = await UserModel.findById(data.id);
      if (!userRecord) {
        throw new Error('Token user not found.')
      }
      if (data.iat < (userRecord.lastestPasswordChange / 1000)) {
        throw new Error('The JWT is expired')
      }
      const secret = crypto.randomBytes(32).toString('hex');
      const googleSecret = base32.encode(crypto.randomBytes(32)).toString().replace(/=/g, '');
      return {
        secret,
        googleAuthenticator: {
          secret: googleSecret,
          url: util.format('otpauth://totp/%s?secret=%s', `Ritta - ${userRecord.username}`, secret)
        }
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
      const accessToken = generateJWT({
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
        passwordChangeRequired: userRecord.passwordChangeRequired
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