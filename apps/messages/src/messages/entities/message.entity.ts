import { Message } from '@rittaschool/shared';
import { Schema, Document } from 'mongoose';
import { v4 } from 'uuid';

export type MessageDocument = Message & Document;

export const MessageSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: v4,
    index: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  created: { type: Number, default: Date.now },
  content: { type: String, required: true },
  seenBy: { type: [String], default: [] },
});
