<<<<<<< HEAD
import { filteredUserStub, userStub } from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(userStub()),
  create: jest.fn().mockResolvedValue(userStub()),
  findAll: jest.fn().mockResolvedValue([userStub()]),
  update: jest.fn().mockResolvedValue(userStub()),
  remove: jest.fn().mockResolvedValue(userStub()),
  filterUser: jest.fn().mockResolvedValue(filteredUserStub()),
=======
import { filteredUserStub, userStub } from "../test/stubs/user.stub";

export const UsersService = jest.fn().mockReturnValue({
    findOne: jest.fn().mockResolvedValue(userStub()),
    create: jest.fn().mockResolvedValue(userStub()),
    findAll: jest.fn().mockResolvedValue([userStub()]),
    update: jest.fn().mockResolvedValue(userStub()),
    remove: jest.fn().mockResolvedValue(userStub()),
    filterUser: jest.fn().mockResolvedValue(filteredUserStub())
>>>>>>> 88c3101501274977b8753f8a5b14d8929a97df1f
});
