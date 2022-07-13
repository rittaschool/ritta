import { ApolloClient, InMemoryCache } from '@apollo/client';

export const graphqlClient = new ApolloClient({
  uri: 'https://devapp.midka.dev/graphql',
  cache: new InMemoryCache({ addTypename: false }),
});
