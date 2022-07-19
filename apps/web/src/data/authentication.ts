import { Challenge } from '@rittaschool/shared';
import request, { gql } from 'graphql-request';
import { useMutation } from 'react-query';
import { GraphQLError } from '../utils/graphql.error';

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
    GraphQLError,
    string,
    unknown
  >(async (identifier) => {
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
