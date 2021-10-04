import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

// Discriminator key means the field what we use to identify the type of the account
@Schema({ discriminatorKey: 'type', timestamps: true })
export class Account {
  @Prop({ required: true, enum: AccountType })
  type: AccountType;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
