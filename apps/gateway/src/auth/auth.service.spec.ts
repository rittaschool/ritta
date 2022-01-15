import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

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
          provide: 'AUTH_BUS',
          useValue: {},
        },
        {
          provide: 'USERS_SERVICE',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>('AUTH_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
