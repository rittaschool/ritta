import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { v4 } from 'uuid';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, default: v4(), unique: true, index: true })
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  secret: string;

  @Prop()
  mfaSecret?: string;

  @Prop([String])
  mfaBackup?: string[];

  @Prop()
  puavoId?: string;

  @Prop()
  yubikeyId?: string;

  @Prop()
  yubiPIN?: string;

  @Prop({
    required: true,
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  })
  accounts: string[];

  @Prop()
  latestLogin?: Date;

  @Prop({ required: true, default: Date.now() })
  latestPasswordChange: Date;

  @Prop({required: true, default: true})
  firstLogin: boolean

  @Prop({ required: true, default: true })
  passwordChangeRequired: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
