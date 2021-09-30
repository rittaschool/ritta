import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUser: User;

  beforeEach(async () => {
    mockUser = {
      accounts: [],
      firstName: 'Midka',
      lastName: 'Developer',
      latestPasswordChange: new Date(-10000),
      passwordChangeRequired: false,
      username: 'Midka',
      password:
        '$argon2i$v=19$m=16,t=2,p=1$elpoYTZtbms5VlREaUZzTw$Pz+UVfrFcvchYr/EM2gO+LQrBWc',
      secret: '12r4jig0pe',
      id: '122fn',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockReturnValue(mockUser)
          }
        },
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: <T>(path: string): T => {
              if (path === 'security.tokens') {
                const tokens: Tokens = {
                  access: {
                    secret: '111fwe',
                    expiresIn: '5m',
                  },
                  refresh: {
                    secret: 'sdfg',
                    expiresIn: '7d',
                  },
                };

                return tokens as any;
              }

              return undefined;
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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
      password: 'hellowhowsitgoinglolthisishashedbyargon2',
    });

    expect(validatedUser.username).toEqual(mockUser.username);
  });
});

const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
