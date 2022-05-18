import { IAccountType } from "../enums";
import { IOAuth2Identifiers } from "../types";
import { IFidoOptions, IMFAOptions } from "./auth";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  alias?: string;
  username?: string;
  email?: string;
  password: string;
  home?: ILocation;
  mfa?: IMFAOptions;
  fido?: IFidoOptions;
  oauth2Identifiers?: IOAuth2Identifiers;
  accounts: IAccount[];
  latestLogin?: Date;
  latestPasswordChange?: Date;
  isFirstLogin: boolean;
  isPasswordChangeRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions: number;
}

export type IAPIUser = Omit<IUser, "password">;

export interface ILocation {
  address: string;
  city: string;
  country: string;
  zip: string;
}

export interface IAccount {
  type: IAccountType;
}
