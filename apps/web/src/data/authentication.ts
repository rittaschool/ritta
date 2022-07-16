import request, { gql } from 'graphql-request';
import { useQuery } from 'react-query';

const ENDPOINT = 'http://localhost:3000/graphql';

export const useLoginStart = (identifier: string) => {
  return useQuery(
    ['startLogin', identifier],
    async () => {
      const data = await request(
        ENDPOINT,
        gql`
      query {
        startLoginProcess(email: ${identifier}) {
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

      console.log(data);
    },
    {
      enabled: !!identifier,
    }
  );
};
