import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'USERS_RESOLVER', useClass: UsersResolver },
        { provide: 'USERS_SERVICE', useValue: {} },
        {
          provide: 'LOGGER',
          useValue: {},
        },
        {
          provide: 'TOKENIZER',
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>('USERS_RESOLVER');
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
