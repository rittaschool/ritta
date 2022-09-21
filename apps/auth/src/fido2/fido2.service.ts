import base64 from '@hexagon/base64';
import { Inject, Injectable } from '@nestjs/common';
import { IErrorType, RittaError } from '@rittaschool/shared';
import { UserService } from '../services/user.service';
import { Fido2 } from './fido2.utils';

@Injectable()
export class Fido2Service {
  constructor(
    @Inject('FIDO2') private fido2: Fido2,
    @Inject('USERS_SERVICE') private usersService: UserService,
  ) {}

  async registration(username: string, displayName: string, id: string) {
    const userId = (await this.usersService.findOne(id)).id;
    const options = await this.fido2.registration(
      username,
      displayName,
      userId,
    );
    return options;
  }

  async completeRegistration(data: any) {
    // let attestation = JSON.parse(
    //   Buffer.from(data.response.attestationObject, 'base64').toString(),
    // );
    console.log(data.response.attestationObject);
    const buff = Buffer.from(data.response.attestationObject, 'base64');
    console.log(buff);
    console.log(base64);
    const attestation = undefined;

    if (!attestation)
      throw new RittaError('No Attestation found', IErrorType.UNKNOWN);

    //TODO save to user model
    const fido2Device = await this.validateAttestation(data);

    console.log('fido2Device', fido2Device);
  }

  async validateAttestation(data: any) {
    const resp = data;

    resp.rawId = base64.toArrayBuffer(resp.rawId, true);

    resp.response.attestationObject = base64.toArrayBuffer(
      resp.response.attestationObject,
      true,
    );

    //TODO update to get the stored challenge from gateway, gateway should send it along with the response
    const storedChallenge = resp.challenge;

    const result = await this.fido2.attestation(resp, origin, storedChallenge);

    //TODO update types to match this
    const fido2Device = {
      credId: result.authnrData.get('credId'),
      public_key: result.authnrData.get('credentialPublicKeyPem'),
      type: resp.type,
      counter: result.authnrData.get('counter'),
    };

    return fido2Device;
  }
}
