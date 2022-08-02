import { GraphQLClient } from 'graphql-request';

const ENDPOINT = 'http://localhost:3000/graphql';

const authToken = sessionStorage.getItem('access_token');

export const client = new GraphQLClient(ENDPOINT, {
  headers: authToken ? { authorization: `Bearer ${authToken}` } : {},
});
