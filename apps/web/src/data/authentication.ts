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

export const submitChallenge = () => {
  return useMutation<
    {
      submitChallenge: {
        user: any;
        challenge: Challenge;
      };
    },
    GraphQLError,
    Challenge,
    unknown
  >(async (challenge) => {
    return await request(
      ENDPOINT,
      gql`
        query SubmitChallenge($challenge: ChallengeInput!) {
          submitChallenge(challenge: $challenge) {
            user {
              id
              firstName
              lastName
            }
            challenge {
              type
              id
              userId
            }
            access_token
            refresh_token
          }
        }
      `,
      {
        challenge,
      }
    );
  });
};

export const continueWithPassword = () => {};
