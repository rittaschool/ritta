import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RandomString } from '../../utils/randomString';
import { Cryptor } from '../../utils/encryption';
import { User, UserDocument } from '../schemas/user.schema';
import { FilteredUser, UsersService } from '../users.service';
import { userStub } from './stubs/user.stub';
import { userDocStub } from './stubs/user-document.stub';

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
                ...options,
                ...userStub(),
                latestLogin: new Date(-10000)
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
                    toObject: () => users.filter((user) => user._id === id)[0],
                  };
                },
              };
            },
            findOne: jest.fn().mockResolvedValue(userDocStub()),
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
            generate: jest.fn().mockReturnValue(userStub().secret)
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
      password: 'test1234567890',
      firstName: 'Test',
      lastName: 'Testing',
    });

    expect(user).toBeDefined();
    expect(user).toEqual(userStub())
  });

  it('should list all users', async () => {
    const allUsers = await service.findAll();

    expect(allUsers).toEqual(users);
  });

  it('should return my user with id', async () => {
    const user = await service.findOne(userStub().id);

    expect(user).toEqual(userStub());
  });

  it('should filter the user', async () => {
    const user: User = {
      accounts: [],
      firstName: 'Midka',
      lastName: 'Developer',
      latestPasswordChange: new Date(-10000),
      password: '12',
      passwordChangeRequired: true,
      secret: '123v33',
      username: 'midka.developer',
      id: '122',
    };

    const filteredUser = (await service.filterUser({
      ...user,
      toObject: () => user,
    } as any)) as unknown as User;

    expect(filteredUser.password).toBe(undefined);
    expect(filteredUser.secret).toBe(undefined);
    expect(filteredUser.mfaBackup).toBe(undefined);
    expect(filteredUser.mfaSecret).toBe(undefined);
  });
});
