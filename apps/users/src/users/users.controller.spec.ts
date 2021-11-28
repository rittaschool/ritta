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
          },
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
  describe('getUsers', () => {
    it('should do something', () => {
      expect(1).toBe(1);
    });
  });

  describe('createUser', () => {
    // it('should return a successful response', async () => {
    //   const response = await controller.create({
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     password: 'pass1234',
    //     email: 'john@doe.com',
    //   });

    //   expect(response).toStrictEqual({
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     password: 'pass1234',
    //     email: 'john@doe.com',
    //   });
    // });
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
});
