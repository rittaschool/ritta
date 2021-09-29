import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema({ timestamps: true })
export class School {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  website: string;

  @Prop(
    raw({
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
    }),
  )
  location: Record<string, any>;

  /*
   * Each school in Finland has a 5-digit school identifier ranging 00000-99999 granted by Statistics Finland/Tilastokeskus
   * 00000 = Unknown.
   */
  @Prop({ required: true, default: '00000' })
  schoolIdentifier: string;

  @Prop()
  email?: string;

  @Prop()
  modules: string[];
}

export const SchoolSchema = SchemaFactory.createForClass(School);