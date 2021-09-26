import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RandomString } from '../utils/randomString';
import { Cryptor } from '../utils/encryption';
import { User, UserDocument } from './schemas/user.schema';
import { FilteredUser, UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const users: Partial<UserDocument>[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: (options: Partial<User>) => {
              const newUser: Partial<UserDocument> = {
                accounts: [],
                latestPasswordChange: new Date(),
                firstName: '',
                lastName: '',
                password: '',
                passwordChangeRequired: true,
                secret: '',
                username: '',
                _id: 'jdpoFW+3JFOMN',
                __v: '0',
                ...options,
              };

              users.push(newUser);

              return {
                toObject: () => newUser,
              };
            },
            find: () => {
              return {
                exec: () =>
                  users.map((user) => {
                    return {
                      toObject: () => user,
                    };
                  }),
              };
            },
            findById: () => {
              return {
                exec: (id: string) => {
                  return {
                    toObject: () => users.filter((user) => user._id === id)[0]
                  }
                },
              };
            },
          },
        },
        {
          provide: Cryptor,
          useValue: {
            encrypt: (text: string) =>
              `ENCRYPTED||ENCRYPTED||${text}||ENCRYPTED||ENCRYPTED`,
            decrypt: (text: string) =>
              text.split('||').splice(0, 2).splice(3, 2),
          },
        },
        {
          provide: RandomString,
          useValue: {
            generate: (_length: number) => 'heresareallylongandrandomstring',
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user', async () => {
    const user = await service.create({
      password: '12345678',
      firstName: 'Midka',
      lastName: 'Developer',
    });

    expect(user).toBeDefined();
    expect(user.username).toBe('midka.developer');
    expect((user as any).password).toBe(undefined);
  });

  it('should list all users', async () => {
    const allUsers = await service.findAll();

    expect(allUsers).toEqual(users);
  });

  it('should return my user with id', async () => {
    const user = await service.findOne((users[0] as any)._id);

    expect(user).toEqual(users[0]);
  });

  it('should filter the user', async () => {
    const user: User = {
      accounts: [],
      firstName: 'Midka',
      lastName: 'Developer',
      latestPasswordChange: new Date(),
      password: '12',
      passwordChangeRequired: true,
      secret: '123v33',
      username: 'midka.developer',
    }

    const filteredUser = await service.filterUser(({...user, toObject: () => user} as any)) as User

    expect(filteredUser.password).toBe(undefined)
    expect(filteredUser.secret).toBe(undefined)
    expect(filteredUser.mfaBackup).toBe(undefined)
    expect(filteredUser.mfaSecret).toBe(undefined)
  })
});
