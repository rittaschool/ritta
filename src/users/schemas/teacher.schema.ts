import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccountType } from './account.schema';

export type TeacherDocument = Teacher & Document;

/**
 * Teacher schema
 * @field {String} type - account type
 * @field {String} titles - titles of the teacher
 * @field {String} abbreviation - abbreviation of the teacher
 * @field {String} phoneNumber - phone number of the teacher
 * @extends {Account}
 */
@Schema()
export class Teacher {
  type: AccountType;

  @Prop({ required: true, type: [String] })
  titles: string[];

  @Prop({ required: true })
  abbrevation: string;

  @Prop({ required: true })
  phoneNumber: string;

  generateAbbrevation(firstName: string, lastName: string) {
    return lastName.substring(0, 3) + firstName.substring(0, 3);
  }
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
