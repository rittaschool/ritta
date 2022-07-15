import { gql } from '@apollo/client';
import { graphqlClient as client } from './baseClient';
import base64 from '@hexagon/base64';

//TODO make types to @shared
export const startFido2Setup = async (identifier: string) => {
  const res = await client.query({
    query: gql`
      query startFido2Setup($identifier: String!) {
        startFidoSetup(email: $identifier) {
          rp {
            name
            id
            icon
          }
          user {
            id
            name
            displayName
          }
          challenge
          pubKeyCredParams {
            alg
            type
          }
          timeout
          attestation
          authenticatorSelection {
            authenticatorAttachment
            requireResidentKey
            userVerification
          }
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
      ...res.data.startFidoSetup,
      user: {
        ...res.data.startFidoSetup.user,
        id: base64.toArrayBuffer(res.data.startFidoSetup.user.id),
      },
      challenge: base64.toArrayBuffer(res.data.startFidoSetup.challenge),
    },
  };
};

export const respondToFido2Setup = async (data: any) => {
  const res = await client.mutate({
    mutation: gql`
      mutation respondToFido2Setup($data: Fido2ResponseInput!) {
        respondToFidoSetup(data: $data)
      }
    `,
    variables: {
      data: {
        publicKey: data.id,
        rawId: base64.fromArrayBuffer(data.rawId),
        response: {
          attestationObject: base64.fromArrayBuffer(
            data.response.attestationObject
          ),
          clientDataJSON: base64.fromArrayBuffer(data.response.clientDataJSON),
        },
        type: data.type,
      },
    },
  });

  return {
    errors: res.errors,
    data: res.data,
  };
};
