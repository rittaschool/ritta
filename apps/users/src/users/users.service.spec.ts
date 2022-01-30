import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import encryptUtils from './encrypt';
import generator from './generator';
import { RpcException } from '@nestjs/microservices';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USERS_REPOSITORY',
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: 'LOGGER',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UsersRepository>('USERS_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('usersRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    jest
      .spyOn(encryptUtils, 'encodePassword')
      .mockImplementation(async () => 'hashed123');

    it('should encode password correctly', async () => {
      await service.createUser({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: '12345678',
      });

      expect(encryptUtils.encodePassword).toHaveBeenCalledWith('12345678');
    });

    it('should call userRepository.findOne with correct params', async () => {
      await service.createUser({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: '12345678',
      });

      expect(userRepository.findOne).toHaveBeenCalledWith('john@doe.com');
    });

    it('should call userRepository.create with correct params', async () => {
      jest
        .spyOn(generator, 'generateBackupCode')
        .mockImplementationOnce(async () => {
          return { code: 'backupcode1', used: false };
        });

      jest
        .spyOn(generator, 'generateMFASecret')
        .mockImplementationOnce(async () => 'secret');

      await service.createUser({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: '12345678',
      });

      expect(userRepository.create).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: 'hashed123',
        username: 'john@doe.com',
        mfa: {
          enabled: false,
          secret: 'secret',
          backupCodes: [{ code: 'backupcode1', used: false }],
        },
      });
    });
  });

  describe('getUsers', () => {
    it('should call userRepository.findAll', async () => {
      await service.getUsers();

      expect(userRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should call userRepository.findOne with id', async () => {
      await service.getUser('1', false);

      expect(userRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should call userRepository.findOne with id but it should throw error', async () => {
      expect(service.getUser('1', true)).rejects.toThrow(
        new RpcException('User not found.'),
      );
    });
  });

  describe('updateUser', () => {
    it.todo('should call userRepository.update with id and validate new user');
  });

  describe('removeUser', () => {
    it('should call userRepository.delete with id', async () => {
      await service.removeUser('1');

      expect(userRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
