import { IAccountType } from "../enums/auth";
import { IAccount } from "../interfaces";

export class Account implements IAccount {
  id: string;
  type: IAccountType;
  permissions: number;

  constructor(id: string, type: IAccountType, permissions: number) {
    this.id = id;
    this.type = type;
    this.permissions = permissions;
  }
}
