import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'AUTH_RESOLVER',
          useClass: AuthResolver,
        },
        {
          provide: 'AUTH_SERVICE',
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>('AUTH_RESOLVER');
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
