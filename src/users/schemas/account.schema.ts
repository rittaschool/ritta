import { ObjectType, Field } from '@nestjs/graphql';
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

/**
 * Account schema
 * @type {AccountType} - Account type
 */
@Schema({ discriminatorKey: 'type', timestamps: true })
@ObjectType()
export class Account {
  @Field()
  @Prop({ required: true, enum: AccountType })
  type: AccountType;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
