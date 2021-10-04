import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { v4 } from 'uuid';
import { Account } from "./account.schema"

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, default: v4(), unique: true, index: true })
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: false, unique: true, index: true })
  username?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  secret: string;

  @Prop(raw({
    backupCodes: { type: [String] },
    secret: { type: String }
  }))
  mfa?: Record<string, any>

  @Prop(raw({
    id: { type: String },
    pin: { type: String } 
  }))
  yubikey?: Record<string, any>

  @Prop(raw({
    opinsys: { type: String }
  }))
  oauth2Identifiers?: Record<string, any>

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

  @Prop({required: true, default: true})
  isFirstLogin: boolean

  @Prop({ required: true, default: true })
  passwordChangeRequired: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
