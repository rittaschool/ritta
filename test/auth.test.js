/*
Ritta Test: Authentication
*/
import { beforeAll } from '@jest/globals';
import mongoose from 'mongoose';
import { UserService, AuthService } from '../build/services';
import { authenticator } from 'otplib';
import crypto from 'crypto';
import { encrypt, decrypt } from '../build/utils/encryption';

// Use same users as in teachers test and few others for the MFA and password required test.
let pekkaLahti = null;
let piaJaakkola = null;
let pasiNiemi = null;
let anneKotka = null;
let iinaSulkari = null;
beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  pekkaLahti = await UserService.createUser('test.pekka', 'Pekka', 'Lahti', 'Password123', true);
  pekkaLahti.passwordChangeRequired = false;
  await pekkaLahti.save();
  piaJaakkola = await UserService.createUser('test.pia', 'Pia', 'Jaakkola', 'Password321', true);
  piaJaakkola.secret = encrypt(authenticator.generateSecret());
  await piaJaakkola.save();
  pasiNiemi = await UserService.createUser('test.pasi', 'Pasi', 'Niemi', 'Password123', true);
  pasiNiemi.secret = encrypt(authenticator.generateSecret());
  pasiNiemi.mfaBackup = [
    crypto.randomBytes(6).toString('hex'),
    crypto.randomBytes(6).toString('hex'),
    crypto.randomBytes(6).toString('hex'),
    crypto.randomBytes(6).toString('hex'),
    crypto.randomBytes(6).toString('hex'),
    crypto.randomBytes(6).toString('hex'),
  ];
  await pasiNiemi.save();
  anneKotka = await UserService.createUser('test.anne', 'Anne', 'Kotka', 'Password321', true);
  anneKotka.passwordChangeRequired = false;
  anneKotka.secret = encrypt(authenticator.generateSecret());
  await anneKotka.save();
  iinaSulkari = await UserService.createUser('test.iina', 'Iina', 'Sulkari', 'Password123', true);
});

describe('Invalid password', function () {
  // Test
  it('Pekka Lahti, password "password123"', async () => {
    expect(AuthService.login('test.pekka', 'password123')).rejects.toBeInstanceOf(Error);
  });

  it('Pekka Lahti, password "Password123 "', async () => {
    expect(AuthService.login('test.pekka', 'Password123 ')).rejects.toBeInstanceOf(Error);
  });

  it('Pia Jaakkola, password "password123"', async () => {
    expect(AuthService.login('test.pia', 'password123')).rejects.toBeInstanceOf(Error);
  });

  it('Pia Jaakkola, password "Password123 "', async () => {
    expect(AuthService.login('test.pia', 'Password123 ')).rejects.toBeInstanceOf(Error);
  });
});

describe('Correct password', function () {
  // Test
  it('Pekka Lahti, correct password', async () => {
    expect(AuthService.login('test.pekka', 'Password123')).resolves.toHaveProperty('accessToken');
    expect(AuthService.login('test.pekka', 'Password123')).resolves.toHaveProperty('refreshToken');
  });

  describe('MFA enabled', function () {
    // Test
    it('Pia Jaakkola, correct password, has mfa_required', async () => {
      expect(AuthService.login('test.pia', 'Password321')).resolves.toHaveProperty('mfaToken');
    });
    
    it('Pia Jaakkola, correct password, invalid mfa code', async () => {
      const { mfaToken } = await AuthService.login('test.pia', 'Password321');
      expect(AuthService.verifyMFA(mfaToken, '000000')).rejects.toBeInstanceOf(Error);
    });

    describe('Correct password, correct mfa code', function () {
      // Test
      it('Anne Kotka, NOT required to change password, has access token', async () => {
        const { mfaToken } = await AuthService.login('test.anne', 'Password321');
        const token = authenticator.generate(decrypt(anneKotka.secret));
        expect(AuthService.verifyMFA(mfaToken, token)).resolves.toHaveProperty('accessToken');
        expect(AuthService.verifyMFA(mfaToken, token)).resolves.toHaveProperty('refreshToken');
      });

      it('Pia Jaakkola, Required to change password', async () => {
        const { mfaToken } = await AuthService.login('test.pia', 'Password321');
        const token = authenticator.generate(decrypt(piaJaakkola.secret));
        expect(AuthService.verifyMFA(mfaToken, token)).resolves.toHaveProperty('passwordChangeToken');
      });
    });
  });

  describe('No mfa, Password change required', function () {
    // Test
    it('Iina Sulkari, New password is same as old one', async () => {
      const { passwordChangeToken } = await AuthService.login('test.iina', 'Password123');
      expect(UserService.changePassword(passwordChangeToken, '', 'Password123')).rejects.toBeInstanceOf(Error);
    });

    it('Iina Sulkari, New password is valid', async () => {
      const { passwordChangeToken } = await AuthService.login('test.iina', 'Password123');
      const response = await UserService.changePassword(passwordChangeToken, '', 'Password321');
      expect(response.success).toBe(true);

      expect(AuthService.login('test.iina', 'Password321')).resolves.toHaveProperty('accessToken');
      expect(AuthService.login('test.iina', 'Password321')).resolves.toHaveProperty('refreshToken');
    });
  });
});