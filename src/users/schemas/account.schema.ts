import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

export enum AccountType {
  STUDENT,
  TEACHER,
  PARENT,
  ADMIN,
}

@Schema()
export class Account {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  type: AccountType;

  @Prop()
  school?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
