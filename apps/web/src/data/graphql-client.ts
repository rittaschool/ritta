import { GraphQLClient } from 'graphql-request';

const ENDPOINT = 'http://localhost:3000/graphql';

const accessToken = sessionStorage.getItem('access_token');

export const client = new GraphQLClient(ENDPOINT, {
  headers: accessToken ? { authorization: `Bearer ${accessToken}` } : {},
});
