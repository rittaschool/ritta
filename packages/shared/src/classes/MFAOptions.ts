import { IMFAOptions } from "../interfaces";
import { BackupCode } from "./BackupCode";

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
