import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import cryptor from './cryptor';
import tokens from './tokens';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'AUTH_SERVICE',
          useClass: AuthService,
        },
        {
          provide: 'USERS_SERVICE',
          useValue: {
            findAll: jest.fn().mockReturnValue([
              {
                id: 1,
                username: 'tester',
                password: 'hashed124',
                mfa: {
                  enabled: false,
                },
              },
            ]),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>('AUTH_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    describe('login', () => {
      it('should return a user', async () => {
        // Mock the cryptor
        jest
          .spyOn(cryptor, 'verifyPassword')
          .mockImplementation(async () => true);

        // Mock the token generator
        jest.spyOn(tokens, 'signToken').mockImplementation(async () => 'token');

        // Run the service code
        const result = await service.login({
          username: 'tester',
          password: '123456',
        });

        expect(result.type).toBe('logged_in');
        expect(result.token).toBe('token');
      });

      it('should throw invalid credentials error', async () => {
        // Mock the cryptor
        jest
          .spyOn(cryptor, 'verifyPassword')
          .mockImplementation(async () => false);

        // Run the service code
        try {
          await service.login({
            username: 'tester',
            password: '123456',
          });
        } catch (err) {
          expect(err.error).toBe('Invalid credentials');
        }
      });
    });

    describe('loginMFA', () => {
      it('should throw invalid token', async () => {
        try {
          const result = await service.loginMFA({
            mfaCode: '12345',
            mfaToken: 'mfa_token',
          });

          console.log(result);
        } catch (error) {
          console.log(error);
          expect(error.error).toBe('Invalid token');
        }
      });
    });
  });
});
