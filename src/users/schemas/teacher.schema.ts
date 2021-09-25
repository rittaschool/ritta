import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema()
export class Teacher {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: [String] })
  titles: string[];

  @Prop({ required: true })
  abbrevation: string;

  generateAbbrevation() {
    return this.lastName.substring(0, 3) + this.firstName.substring(0, 3);
  }
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
