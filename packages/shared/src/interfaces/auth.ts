export interface IFidoOptions {
  enabled: boolean;
  devices: IFidoDevice[];
}

export interface IFidoDevice {
  enabled: boolean;
  public_key: string;
}

export interface IMFAOptions {
  enabled: boolean;
  backupCodes: IBackupCode[];
  secret: string;
}

export interface IBackupCode {
  code: string;
  used: boolean;
}
