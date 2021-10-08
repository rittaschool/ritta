import { Provider } from '../../types';

export const Oauth2Service = jest.fn().mockReturnValue({
  getAuthorizationUri: jest
    .fn()
    .mockResolvedValue('https://example.com/oauth2/authorize'),
  verifyCode: jest.fn().mockResolvedValue({
    firstName: 'John',
    lastName: 'Smith',
    provider: Provider.OPINSYS,
    id: '1906982',
  }),
});
