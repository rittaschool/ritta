import { Schema, Document } from 'mongoose';
import { YubikeyOptions } from '@rittaschool/shared';

export type YubikeyDocument = YubikeyOptions & Document;

export const YubikeySchema = new Schema({
  enabled: { type: Boolean, required: true, default: false },
  id: String, // not required because it may not be set yet
  pin: String,
});
