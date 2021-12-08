import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'USERS_SERVICE',
          useClass: UsersService,
        },
        { provide: 'EVENT_BUS', useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>('USERS_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
