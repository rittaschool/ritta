import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'USERS_SERVICE',
          useValue: {
            createUser: jest.fn((x) => x),
            getUsers: jest.fn(() => []),
            getUser: jest.fn(() => ({})),
            updateUser: jest.fn(() => ({})),
            removeUser: jest.fn(() => ({})),
          },
        },
        {
          provide: 'LOGGER',
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>('USERS_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  // TODO: implement tests
  describe('createUser', () => {
    it('should return a successful response', async () => {
      const response = await controller.create({
        firstName: 'John',
        lastName: 'Doe',
        password: 'pass1234',
        email: 'john@doe.com',
      });

      expect(response).toStrictEqual({
        firstName: 'John',
        lastName: 'Doe',
        password: 'pass1234',
        email: 'john@doe.com',
      });
    });
    it('should throw an error', async () => {
      jest.spyOn(usersService, 'createUser').mockImplementationOnce(() => {
        throw new RpcException('Email or username is required.');
      });
      try {
        await controller.create({
          firstName: 'John',
          lastName: 'Doe',
          password: 'pass1234',
        });
      } catch (error) {}
    });
  });

  describe('getUsers', () => {
    it('should call usersService.getUsers', async () => {
      await controller.getUsers();

      expect(usersService.getUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUser', () => {
    it('should call usersService.getUser with id', async () => {
      await controller.getUser({ id: '123', throwError: true });

      expect(usersService.getUser).toHaveBeenCalledTimes(1);
      expect(usersService.getUser).toHaveBeenCalledWith('123', true);
    });
  });

  describe('updateUser', () => {
    it('should call usersService.updateUser with correct params', async () => {
      await controller.updateUser({ id: '123', firstName: 'Nohj' });

      expect(usersService.updateUser).toHaveBeenCalledTimes(1);
      expect(usersService.updateUser).toHaveBeenCalledWith({
        id: '123',
        firstName: 'Nohj',
      });
    });
  });

  describe('removeUser', () => {
    it('should call usersService.removeUser with id', async () => {
      await controller.removeUser({ id: '123' });

      expect(usersService.removeUser).toHaveBeenCalledTimes(1);
      expect(usersService.removeUser).toHaveBeenCalledWith('123');
    });
  });
});
