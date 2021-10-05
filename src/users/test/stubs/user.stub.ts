import { FilteredUser } from 'src/users/users.service';
import { User } from '../../schemas/user.schema';

export const userStub = (): User => {
  return {
    accounts: [],
    firstName: 'Test',
    id: 'c1bb2f77-756e-4371-b692-51ec50b6de81',
    lastName: 'Testing',
    latestPasswordChange: new Date(-100000),
    password:
      'ENCRYPTED||ENCRYPTED||$argon2i$v=19$m=16,t=2,p=1$cDl2TTRhb0RxTnJUQWFaZg$V3zRUzi4CSeOh/FLI9Tt9rJ6KdY||ENCRYPTED||ENCRYPTED',
    passwordChangeRequired: true,
    secret: 'oni2309u09fn0934jf98j23',
    username: 'test.testing',
    latestLogin: new Date(-10000),
    isFirstLogin: false,
    home: {
      city: 'Helsinki',
      postalCode: '00100',
      address: 'Testikatu 1',
    },
  };
};

export const filteredUserStub = (): FilteredUser => {
  return {
    accounts: [],
    firstName: 'Test',
    id: 'c1bb2f77-756e-4371-b692-51ec50b6de81',
    lastName: 'Testing',
    latestPasswordChange: new Date(-100000),
    passwordChangeRequired: true,
    username: 'test.testing',
    latestLogin: new Date(-10000),
    isFirstLogin: false,
    home: {
      city: 'Helsinki',
      postalCode: '00100',
      address: 'Testikatu 1',
    },
  };
};
