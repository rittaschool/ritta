import { Message } from '@rittaschool/shared';
import { Schema, Document } from 'mongoose';

export type MessageDocument = Message & Document;

export const ThreadSchema = new Schema({
  senderId: {
    type: String,
    required: true,
  },
  created: { type: Number, default: Date.now },
  content: { type: String, required: true },
  seenBy: { type: [String], default: [] },
  removed: { type: Boolean, default: false },
});
