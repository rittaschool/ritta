import { UserDocument } from '../../schemas/user.schema';
import { userStub } from './user.stub';

export const userDocStub = (): Partial<UserDocument> => {
  return {
    ...userStub(),
    toObject: () => userStub(),
  };
};
