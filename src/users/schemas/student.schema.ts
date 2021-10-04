import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccountType } from './account.schema';

export type StudentDocument = Student & Document;

/**
 * Student schema
 * @field {AccountType} type - type of account
 * @field {String} phoneNumber - phone number of student
 * @extends {Account}
 */
@Schema({ timestamps: true })
export class Student {
  type: AccountType;

  @Prop()
  phoneNumber?: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
