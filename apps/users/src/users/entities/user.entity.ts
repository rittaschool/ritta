import {
  User,
  MFAOptions,
  YubikeyOptions,
  Oauth2Identifiers,
  Location,
} from '@rittaschool/shared';
import { Document, Schema } from 'mongoose';
import { v4 } from 'uuid';

export type UserDocument = User & Document;

export const UserSchema = new Schema({
  id: { type: String, default: v4(), required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  alias: { type: String, required: false },
  username: { type: String, unique: true, required: false },
  email: { type: String, required: false, unique: true },
  password: String,
  accounts: [String], // String because it's the id of the account stored in the accounts service
  latestLogin: { type: Date, default: Date.now() },
  latestPasswordChange: { type: Date, default: Date.now() },
  isFirstLogin: { type: Boolean, default: true },
  isPasswordChangeRequired: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
