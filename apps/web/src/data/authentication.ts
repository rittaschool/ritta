import { gql } from 'graphql-request';

export const startLoginQuery = gql`
  query startLogin($identifier: String!) {
    startLoginProcess(email: $identifier) {
      challenge {
        type
        id
        userId
      }
      userFirstName
      userPhotoUri
    }
  }
`;
