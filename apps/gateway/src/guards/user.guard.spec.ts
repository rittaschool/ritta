import { Test, TestingModule } from '@nestjs/testing';
import { UserGuard } from './user.guard';

describe('UserGuard', () => {
  let guard: UserGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserGuard,
        { provide: 'USERS_SERVICE', useValue: {} },
        { provide: 'LOGGER', useValue: {} },
        { provide: 'TOKENIZER', useValue: {} },
      ],
    }).compile();

    guard = module.get<UserGuard>(UserGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
