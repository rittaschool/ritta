import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type AccountDocument = Account & Document;

export enum AccountType {
  GUEST = 0,
  STUDENT = 1,
  PARENT = 2,
  TEACHER = 3,
  PRINCIPAL = 4,
  SCHOOL_SECRETARY = 5,
  STUDY_INSTRUCTOR = 6,
  STAFF = 7,
  ADMIN = 100,
}

@Schema()
export class Account {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: AccountType })
  type: AccountType;

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  })
  school?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);