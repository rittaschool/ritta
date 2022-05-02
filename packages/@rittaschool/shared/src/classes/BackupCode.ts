import { IBackupCode } from "../interfaces";

export class BackupCode implements IBackupCode {
  code: string;
  used: boolean;

  constructor(code: string, used: boolean) {
    this.code = code;
    this.used = used;
  }
}
