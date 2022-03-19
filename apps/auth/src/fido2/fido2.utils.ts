import * as base64 from '@hexagon/base64';
import { Fido2Lib } from 'fido2-lib';

export class Fido2 {
  f2l: Fido2Lib;

  constructor(rpId: string, rpName: string, rpIcon: string, timeout: number) {
    this.f2l = new Fido2Lib({
      timeout,
      rpId,
      rpName,
      rpIcon,
      challengeSize: 128,
      attestation: 'none',
      cryptoParams: [-7, -257],
      authenticatorAttachment: 'cross-platform',
      authenticatorRequireResidentKey: false,
      authenticatorUserVerification: 'preferred',
    });
  }

  async registration(username: string, displayName: string, userId: string) {
    let options = await this.f2l.attestationOptions();

    // make sure to add options.user.id
    options.user = {
      id: userId,
      name: username,
      displayName: displayName,
    };

    let base64Challenge = (base64 as any).fromArrayBuffer(options.challenge);

    return {
      ...options,
      challenge: base64Challenge,
    };
  }

  async attestation(
    clientAttestationResponse: any,
    origin: string,
    challenge: string,
  ) {
    let regResult = await this.f2l.attestationResult(
      clientAttestationResponse,
      {
        origin: origin,
        challenge: challenge,
        factor: 'either',
      },
    );

    return regResult;
  }
}
