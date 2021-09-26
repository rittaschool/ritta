import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RandomString } from '../utils/randomString';
import { Cryptor } from '../utils/encryption';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
        {
          provide: Cryptor,
          useValue: () => {
            encrypt: (text: string) =>
              `ENCRYPTED||ENCRYPTED||${text}||ENCRYPTED||ENCRYPTED`;
            decrypt: (text: string) =>
              text.split('||').splice(0, 2).splice(3, 2);
          },
        }, 
        {
          provide: RandomString,
          useValue: {
            generate: (_length: number) => 'heresareallylongandrandomstring'
          }
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
