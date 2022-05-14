import { GqlUserGuard } from './gql-user.guard';

describe('GqlUserGuard', () => {
  it('should be defined', () => {
    expect(new GqlUserGuard()).toBeDefined();
  });
});
