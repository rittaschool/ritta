import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParentDocument = Parent & Document;

@Schema({ timestamps: true })
export class Parent {
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

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  workNumber?: string;

  @Prop({ required: true })
  email: string;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
