import { Instance } from '@rittaschool/shared';
import { Schema, Document } from 'mongoose';
import { v4 } from 'uuid';

export type InstanceDocument = Instance & Document;

export const InstanceSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: v4,
    index: true,
  },
  name: { type: String, required: true },
  contact: {
    name: { type: String, required: true },
    title: String,
    phoneNumber: String,
    email: String,
  },
  features: {
    type: [Number],
    required: true,
  },
});
