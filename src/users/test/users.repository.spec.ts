import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { UserModel } from './support/user.model';
import { User } from '../schemas/user.schema';
import { userStub } from './stubs/user.stub';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let userModel: UserModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useClass: UserModel,
        },
      ],
    }).compile();

    usersRepository = await module.get<UsersRepository>(UsersRepository);
    userModel = await module.get<UserModel>(getModelToken(User.name));
  });

  describe('findOne', () => {
    let userFilterQuery: any;

    describe('when findOne is called', () => {
      let user: User;

      beforeEach(async () => {
        userFilterQuery = {
          id: userStub().id,
        };

        jest.spyOn(userModel, 'findOne');
        user = await usersRepository.findOne(userFilterQuery);

        jest.clearAllMocks();
      });

      it('then it should call the userModel', () => {
        expect(userModel.findOne).toHaveBeenCalled();
      });

      it('then it should return a user', () => {
        expect(user).toEqual({
          ...userStub(),
          toObject: () => userStub,
        });
      });
    });
  });

  describe('find', () => {
    describe('when find is called', () => {
      let users: User[];
      let userFilterQuery: any;

      beforeEach(async () => {
        userFilterQuery = {
          id: userStub().id,
        };

        jest.spyOn(userModel, 'find');
        users = await usersRepository.find(userFilterQuery);
      });

      it('then it should call the userModel', () => {
        expect(userModel.find).toHaveBeenCalledWith(userFilterQuery);
      });

      it('then it should return a user', () => {
        expect(users).toStrictEqual([
          { ...userStub(), toObject: () => userStub },
        ]);
      });
    });
  });

  describe('findOneAndUpdate', () => {
    describe('when findOneAndUpdate is called', () => {
      let user: User;
      let userFilterQuery: any;

      beforeEach(async () => {
        userFilterQuery = {
          id: userStub().id,
        };

        jest.spyOn(userModel, 'findOneAndUpdate');
        user = await usersRepository.findOneAndUpdate(
          userFilterQuery,
          userStub(),
        );
      });

      it('then it should call the userModel', () => {
        expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
          userFilterQuery,
          userStub(),
          { new: true },
        );
      });

      it('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('create', () => {
    describe('when create is called', () => {
      let user: User;
      let saveSpy: jest.SpyInstance;
      let constructorSpy: jest.SpyInstance;

      beforeEach(async () => {
        saveSpy = jest.spyOn(UserModel.prototype, 'save');
        constructorSpy = jest.spyOn(UserModel.prototype, 'constructorSpy');
        user = await usersRepository.create(userStub());
      });

      it('then it should call the userModel', () => {
        expect(saveSpy).toHaveBeenCalled();
        expect(constructorSpy).toHaveBeenCalledWith(userStub());
      });

      it('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });
});
