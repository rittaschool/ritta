import { Schema, Document } from 'mongoose';

interface FidoDevice {
  enabled: boolean;

  public_key: string;
}

export type FidoDeviceDocument = FidoDevice & Document;

export const FidoDeviceSchema = new Schema({
  enabled: { type: Boolean, required: true, default: false },
  public_key: { type: String },
});
