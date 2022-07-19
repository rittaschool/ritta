import { Challenge } from '@rittaschool/shared';
import request, { gql } from 'graphql-request';
import { useMutation } from 'react-query';

const ENDPOINT = 'http://localhost:3000/graphql';

export const useLoginStart = () => {
  return useMutation<
    {
      startLoginProcess: {
        userFirstName: string;
        userPhotoUri: string;
        challenge: Challenge;
      };
    },
    {
      message?: string
      response?: {
        errors: {
          message: string
          extensions: {
            code: string
            response: {
              statusCode: string
              message: string
              error: string
            }
          }
        }[]
      }
    },
    string,
    unknown
  >(async (identifier: string) => {
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
