import {
  ILocation,
  IMFAOptions,
  IBackupCode,
  IYubikeyOptions,
  IOAuth2Identifiers,
} from '@rittaschool/shared';

export class Location implements ILocation {
  address: string;
  city: string;
  country: string;
  zip: string;

  constructor(address: string, city: string, country: string, zip: string) {
    this.address = address;
    this.city = city;
    this.country = country;
    this.zip = zip;
  }
}

export class MFAOptions implements IMFAOptions {
  enabled: boolean;
  secret: string;
  backupCodes: BackupCode[];

  constructor(enabled: boolean, secret: string, backupCodes: BackupCode[]) {
    this.enabled = enabled;
    this.secret = secret;
    this.backupCodes = backupCodes;
  }
}

export class BackupCode implements IBackupCode {
  code: string;
  used: boolean;

  constructor(code: string, used: boolean) {
    this.code = code;
    this.used = used;
  }
}

export class YubikeyOptions implements IYubikeyOptions {
  enabled: boolean;
  id: string;
  pin: string;

  constructor(enabled: boolean, id: string, pin: string) {
    this.enabled = enabled;
    this.id = id;
    this.pin = pin;
  }
}

export class Oauth2Identifiers implements IOAuth2Identifiers {
  opinsys?: string;
}
