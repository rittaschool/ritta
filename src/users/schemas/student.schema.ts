import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  alias: string;

  @Prop(
    raw({
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
    }),
  )
  home: Record<string, any>;

  @Prop()
  phoneNumber?: string;

  @Prop()
  email?: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
