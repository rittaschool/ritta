import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { School } from '../../schools/schemas/school.schema';
import { Student } from './student.schema';
import { Teacher } from './teacher.schema';
import { Parent } from './parent.schema';

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
  @Prop({ required: true, enum: AccountType })
  type: AccountType;

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  })
  school?: School;

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }
  })
  student?: Student

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
  })
  teacher?: Teacher

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' }
  })
  parent?: Parent
}

export const AccountSchema = SchemaFactory.createForClass(Account);
