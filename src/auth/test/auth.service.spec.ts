import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/schemas/user.schema';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { userStub } from '../../users/test/stubs/user.stub';
import { Tokens } from '../types';
import { Cryptor } from '../../utils/encryption.service';

jest.mock('../../users/users.service');
jest.mock('../../utils/encryption.service');

describe('AuthService', () => {
  let service: AuthService;
  let mockUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: <T>(path: string): T => {
              switch (path) {
                case 'security.tokens': {
                  const tokens: Tokens = {
                    access: {
                      expiresIn: '5m',
                      secret: 'domcoepo',
                    },
                    refresh: {
                      expiresIn: '7d',
                      secret: 'pocdcmone',
                    },
                  };

                  return tokens as unknown as T;
                }
              }
              return undefined;
            },
          },
        },
        Cryptor,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest
              .fn()
              .mockReturnValue(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
              ),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUser = userStub();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a token session', async () => {
    const tokens = await service.login(mockUser);

    expect(tokens.accessToken).toMatch(jwtRegex);
    expect(tokens.refreshToken).toMatch(jwtRegex);
  });

  it('should validate the user', async () => {
    const validatedUser = await service.validate({
      username: 'midka.developer',
      password: 'test124567890',
    });

    expect(validatedUser.username).toEqual(mockUser.username);
  });
});

const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
