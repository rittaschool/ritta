import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccountType } from './account.schema';

export type ParentDocument = Parent & Document;

@Schema({ timestamps: true })
export class Parent {
  type: AccountType;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  workNumber?: string;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
