import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersController } from '../users.controller';
import { FilteredUser, UsersService } from '../users.service';
import { filteredUserStub, userStub } from './stubs/user.stub';

jest.mock('../users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('getUser', () => {
    describe('when getUser is called', () => {
      let user: FilteredUser;

      beforeEach(async () => {
        user = await controller.getUser(userStub().id);
      });

      it('then it should call usersService', () => {
        expect(usersService.findOne).toBeCalledWith(userStub().id);
      });

      it('then it should filter and return a user', () => {
        expect(user).toEqual(filteredUserStub());
        expect(usersService.filterUser).toBeCalledWith(userStub());
      });
    });
  });

  describe('getUsers', () => {
    describe('when getUsers is called', () => {
      let users: FilteredUser[];

      beforeEach(async () => {
        users = await controller.getUsers();
      });

      it('then it should call usersService', () => {
        expect(usersService.findAll).toBeCalledTimes(1);
      });

      it('then it should filter and return the users', () => {
        expect(users).toEqual([filteredUserStub()]);
        expect(usersService.filterUser).toBeCalledWith(userStub());
      });
    });
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let user: FilteredUser;
      let createUserDto: CreateUserDto;

      beforeEach(async () => {
        createUserDto = {
          firstName: filteredUserStub().firstName,
          lastName: filteredUserStub().lastName,
          password: 'test1234567890',
        };

        user = await controller.createUser(createUserDto);
      });

      it('then it should call usersService', () => {
        expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      });

      it('then it should return only the filtered user', () => {
        expect(user).toEqual(filteredUserStub());
      });
    });
  });

  describe('removeUser', () => {
    describe('when removeUser is called', () => {
      let user: FilteredUser;

      beforeEach(async () => {
        user = await controller.removeUser(filteredUserStub().id);
      });

      it('then it should call usersService', () => {
        expect(usersService.remove).toBeCalledWith(filteredUserStub().id);
      });

      it('then it should filter and return the user', () => {
        expect(user).toEqual(filteredUserStub());
      });
    });
  });
});
