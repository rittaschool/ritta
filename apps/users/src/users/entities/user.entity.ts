import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IAccount,
  ILocation,
  IMFAOptions,
  IOAuth2Identifiers,
  IUser,
  IYubikeyOptions,
} from '@rittaschool/shared';
import { Document } from 'mongoose';
import { v4 } from 'uuid';
import {
  MFAOptions,
  Location,
  YubikeyOptions,
  Oauth2Identifiers,
} from './classes';

export type UserDocument = User & Document;
@Schema()
export class User implements Omit<IUser, 'accounts'> {
  @Prop({ unique: true, default: v4(), required: true, index: true })
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  alias?: string;

  @Prop()
  username?: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, type: Location })
  home: ILocation;

  @Prop({ required: false, type: MFAOptions })
  mfa?: IMFAOptions;

  @Prop({ required: false, type: YubikeyOptions })
  yubikey?: IYubikeyOptions;

  @Prop({ required: false, type: Oauth2Identifiers })
  oauth2Identifiers?: IOAuth2Identifiers;

  // string type because we are going to store the accounts in a diffrent service. The string will be the id of the account
  @Prop({ required: true, type: [String], default: [] })
  accounts: string[];
  latestLogin?: Date;
  latestPasswordChange?: Date;
  isFirstLogin: boolean;
  isPasswordChangeRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
