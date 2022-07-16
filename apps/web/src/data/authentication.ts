import request, { gql } from 'graphql-request';
import { useMutation } from 'react-query';

const ENDPOINT = 'http://localhost:3000/graphql';

export const useLoginStart = () => {
  return useMutation(async (identifier: string) => {
    return await request(
      ENDPOINT,
      gql`
      query {
        startLoginProcess(email: "${identifier}") {
          challenge {
            type
            id
            userId
          }
          userFirstName
          userPhotoUri
        }
      }
    `
    );
  });
};
