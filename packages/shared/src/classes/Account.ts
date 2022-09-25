import { IAccountType } from "../enums/auth";
import { IAccount } from "../interfaces";

export class Account implements IAccount {
  type: IAccountType;
  permissions: number;

  constructor(type: IAccountType, permissions: number) {
    this.type = type;
    this.permissions = permissions;
  }
}
