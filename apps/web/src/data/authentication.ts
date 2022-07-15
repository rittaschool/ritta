import { gql } from "@apollo/client";
import { Challenge, IUser } from "@rittaschool/shared";
import { graphqlClient as client } from "./baseClient";

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

export const startLogin = async (
  identifier: string
): Promise<{
  data?: {
    challenge: Challenge;
    user: {
      firstName: string;
      photoUri: string;
    };
  };
  errors?: readonly unknown[];
  loading: boolean;
}> => {
  try {
    const res = await client.query({
      query: gql`
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
      `,
      variables: {
        identifier,
      },
    });

    return {
      loading: res.loading,
      errors: res.errors,
      data: {
        challenge: res.data.startLoginProcess.challenge,
        user: {
          firstName: res.data.startLoginProcess.userFirstName,
          photoUri: res.data.startLoginProcess.userPhotoUri,
        },
      },
    };
  } catch (error) {
    return {
      errors: [error],
      loading: false,
    };
  }
};

export const submitChallenge = async (
  challenge: Challenge
): Promise<{
  data?: {
    challenge?: Challenge;
    user?: IUser;
  };
  errors?: readonly unknown[];
  loading: boolean;
}> => {
  const challengeInput: Challenge = {
    id: challenge.id,
    type: challenge.type,
    userId: challenge.userId,
    data: {},
  };

  if (challenge.data?.passwordData) {
    challengeInput.data!.passwordData = challenge.data.passwordData;
  }

  if (challenge.data?.otpData) {
    challengeInput.data!.otpData = challenge.data.otpData;
  }

  try {
    const res = await client.query({
      query: gql`
        query SubmitChallenge($challenge: ChallengeInput!) {
          submitChallenge(challenge: $challenge) {
            user {
              id
              firstName
              username
            }
            challenge {
              type
            }
          }
        }
      `,
      variables: {
        challenge: challengeInput,
      },
    });

    return {
      loading: res.loading,
      errors: res.errors,
      data: {
        challenge: res.data.submitChallenge.challenge,
        user: res.data.submitChallenge.user,
      },
    };
  } catch (error) {
    console.log("auth", error);

    return {
      errors: [error],
      loading: false,
    };
  }
};
