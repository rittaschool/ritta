import { User } from '@rittaschool/shared';
import { Document, Schema } from 'mongoose';
import { v4 } from 'uuid';
import { FidoSchema } from './fido.entity';
import { LocationSchema } from './location.entity';
import { MFASchema } from './mfa.entity';
import { Oauth2Schema } from './oauth2.entity';

export type UserDocument = User & Document;

export const UserSchema = new Schema({
  id: { type: String, default: v4, required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  alias: { type: String, required: false },
  username: { type: String, unique: true, required: false },
  email: { type: String, required: false }, // not unique, because it could be null
  password: String,
  accounts: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    default: [],
  },
  mfa: {
    type: MFASchema,
    default: {
      enabled: false,
      secret: ``, // No need to generate here...
    },
  },
  fido: {
    type: FidoSchema,
    default: {
      enabled: false,
    },
  },
  oauth2Identifiers: Oauth2Schema,
  home: {
    // TODO: move to account
    type: LocationSchema, // Not essential
    required: false,
  },
  latestLogin: {
    type: Number,
    default: Math.floor(new Date().getTime() / 1000),
  },
  latestPasswordChange: {
    type: Number,
    default: Math.floor(new Date().getTime() / 1000),
  },
  isFirstLogin: { type: Boolean, default: true },
  isPasswordChangeRequired: { type: Boolean, default: true },
  createdAt: { type: Number, default: Math.floor(new Date().getTime() / 1000) },
  updatedAt: { type: Number, default: Math.floor(new Date().getTime() / 1000) },
});
