import { GraphQLClient } from 'graphql-request';

const ENDPOINT = 'http://localhost:3000/graphql';

export const client = new GraphQLClient(ENDPOINT, {
  headers: {
    authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
  },
});
