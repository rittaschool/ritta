import { FidoOptions } from '@rittaschool/shared';
import { Schema, Document } from 'mongoose';
import { FidoDeviceSchema } from './fidoDevice.entity';

export type FidoDocument = FidoOptions & Document;

export const FidoSchema = new Schema({
  enabled: { type: Boolean, required: true, default: false },
  devices: [FidoDeviceSchema],
});
