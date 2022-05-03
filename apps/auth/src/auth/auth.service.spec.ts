import { Test, TestingModule } from '@nestjs/testing';
import {
  generateChallenge,
  IChallengeType,
  IErrorType,
  RittaError,
} from '@rittaschool/shared';
import { AuthService } from './auth.service';
import cryptor from './cryptor';
import tokenizer from './tokenizer';

jest.mock('@rittaschool/shared', () => ({
  ...(jest.requireActual('@rittaschool/shared') as any), // required for errors to work
  generateChallenge: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  // Mocks
  let findOneUser: jest.Mock;

  beforeEach(async () => {
    findOneUser = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'AUTH_SERVICE',
          useClass: AuthService,
        },
        {
          provide: 'USERS_SERVICE',
          useValue: {
            findOne: findOneUser,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>('AUTH_SERVICE');

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loginWithPassword', () => {
    it('should throw an error if user not found', () => {
      findOneUser.mockResolvedValue(undefined);

      expect(
        service.loginWithPassword('12345678', 'testihenkilö@ritta.app'),
      ).rejects.toThrowError(
        new RittaError('User not found!', IErrorType.USER_NOT_FOUND),
      );
    });

    it('should throw error if password is incorrect', () => {
      findOneUser.mockResolvedValue({ email: 'testihenkilö@ritta.app' });

      jest
        .spyOn(cryptor, 'verifyPassword')
        .mockImplementation(async () => false);

      expect(
        service.loginWithPassword('12345678', 'testihenkilö@ritta.app'),
      ).rejects.toThrowError(
        new RittaError('Invalid credentials', IErrorType.INVALID_CREDENTIALS),
      );
    });

    it('should generate a new otp challenge if mfa is enabled', () => {
      findOneUser.mockResolvedValue({
        email: 'testihenkilö@ritta.app',
        mfa: {
          enabled: true,
        },
      });

      jest
        .spyOn(cryptor, 'verifyPassword')
        .mockImplementation(async () => true);

      const challenge = {
        type: IChallengeType.OTP_NEEDED,
        userId: 'testihenkilö@ritta.app',
        id: 'challenge-some-id',
        data: { otpData: { otp: '' } },
      };

      (generateChallenge as jest.Mock).mockReturnValue(challenge);

      expect(
        service.loginWithPassword('12345678', 'testihenkilö@ritta.app'),
      ).resolves.toEqual({
        challenge,
      });
    });

    it('should generate a new token if mfa is disabled', () => {
      const user = {
        email: 'testihenkilö@ritta.app',
        mfa: {
          enabled: false,
        },
      };

      findOneUser.mockResolvedValue(user);

      jest
        .spyOn(cryptor, 'verifyPassword')
        .mockImplementation(async () => true);
      jest
        .spyOn(tokenizer, 'signToken')
        .mockImplementationOnce(async () => 'refresh-token')
        .mockImplementationOnce(async () => 'access-token');

      expect(
        service.loginWithPassword('12345678', 'testihenkilö@ritta.app'),
      ).resolves.toEqual({
        user,
        tokens: {
          // snyk warning
          // file deepcode ignore HardcodedNonCryptoSecret: <please specify a reason of ignoring this>
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      });
    });
  });
});
