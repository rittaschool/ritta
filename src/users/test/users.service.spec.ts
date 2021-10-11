import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RandomString } from '../../utils/randomString';
import { Cryptor } from '../../utils/encryption.service';
import { User, UserDocument } from '../schemas/user.schema';
import { UsersService } from '../users.service';
import { filteredUserStub, userStub } from './stubs/user.stub';
import { UsersRepository } from '../users.repository';
import { UserModel } from './support/user.model';

jest.mock('../../utils/encryption.service');

describe('UsersService', () => {
  let service: UsersService;

  const users: Partial<UserDocument>[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        UsersService,
        Cryptor,
        {
          provide: RandomString,
          useValue: {
            generate: jest.fn().mockReturnValue(userStub().secret),
          },
        },
        {
          provide: getModelToken(User.name),
          useClass: UserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    users.length = 0;
    users.push(userStub());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user', async () => {
    users.length = 0;

    const user = await service.create({
      password: 'test1234567890',
      firstName: 'Test1',
      lastName: 'Testing',
      oauth2Identifiers: {},
    });

    expect(user).toBeDefined();
    expect(user).toEqual(userStub());
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
    const filteredUser = await service.filterUser(userStub());

    expect(filteredUser).toEqual(filteredUserStub());
  });
});

// {
//   provide: getModelToken(User.name),
//   useValue: {
//     create: (options: Partial<User>) => {
//       const newUser: Partial<UserDocument> = {
//         ...options,
//         ...userStub(),
//         latestLogin: new Date(-10000),
//       };

//       users.push(newUser);

//       return {
//         toObject: () => newUser,
//       };
//     },
//     find: () => {
//       return {
//         exec: () =>
//           users.map((user) => {
//             return {
//               toObject: () => user,
//             };
//           }),
//       };
//     },
//     findById: () => {
//       return {
//         exec: (id: string) => {
//           return {
//             toObject: () => users.filter((user) => user._id === id)[0],
//           };
//         },
//       };
//     },
//     findOne: jest.fn().mockResolvedValue(userDocStub()),
//   },
// },
