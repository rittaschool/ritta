import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { v4 } from 'uuid';
import { Account } from './account.schema';
import { HomeAddress } from '../home.definition';

export type UserDocument = User & Document;

/**
 * User schema
 * @id {String} - User UUID version 4
 * @firstName {String} - User's first name
 * @lastName {String} - User's last name
 * @alias {String} - User's alias
 * @username {String} - User's username
 * @email {String} - User's email
 * @password {String} - User's password
 * @home {HomeAddress} - User's home address
 * @secret {String} - User's encryption secret
 * @mfa {Object} - User's MFA settings
 * @yubikey {Object} - User's Yubikey settings
 * @oauth2Identifiers {Object} - User's OAuth2 identifiers - { opinsys?: string }
 * @accounts {Array<Account>} - User's accounts
 * @latestLogin {Date} - User's latest login date
 * @latestPasswordChange {Date} - User's latest password change date
 * @isFirstLogin {Boolean} - User's first login flag
 * @passwordChangeRequired {Boolean} - User's password change required flag
 */
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, default: v4(), unique: true, index: true })
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  alias?: string;

  @Prop({ required: false, unique: true, index: true })
  username?: string;

  @Prop({ required: false, unique: true, index: true })
  email?: string;

  @Prop({ required: true })
  password: string;

  @Prop({type: HomeAddress, required: false})
  home: HomeAddress;

  @Prop({ required: true })
  secret: string;

  @Prop(
    raw({
      backupCodes: { type: [String] },
      secret: { type: String },
    }),
  )
  mfa?: Record<string, any>;

  @Prop(
    raw({
      id: { type: String },
      pin: { type: String },
    }),
  )
  yubikey?: Record<string, any>;

  @Prop(
    raw({
      opinsys: { type: String },
    }),
  )
  oauth2Identifiers?: Record<string, any>;

  @Prop({
    required: true,
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  })
  accounts: Account[];

  @Prop()
  latestLogin?: Date;

  @Prop({ required: true, default: Date.now() })
  latestPasswordChange: Date;

  @Prop({ required: true, default: true })
  isFirstLogin: boolean;

  @Prop({ required: true, default: true })
  passwordChangeRequired: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
