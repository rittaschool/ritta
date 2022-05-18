import { Thread } from '@rittaschool/shared/src/classes';
import { Schema, Document } from 'mongoose';
import { v4 } from 'uuid';

export type ThreadDocument = Thread & Document;

export const ThreadSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: v4,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  sender: {
    type: {
      id: {
        type: String,
        required: true,
      },
      archived: {
        type: Boolean,
        default: false,
      },
    },
    required: true,
  },
  removed: {
    type: Boolean,
    default: false,
  },
  showNames: {
    type: Boolean,
    default: false,
  },
  canReply: {
    type: Boolean,
    default: false,
  },
  draft: {
    type: Boolean,
    default: false,
  },
  recipients: {
    type: [
      {
        type: {
          type: Number,
          required: true,
        },
        id: {
          type: String,
          required: true,
        },
        archived: {
          type: Boolean,
          default: false,
        },
      },
    ],
    required: true,
  },
  messages: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    required: true,
  },
  created: { type: Number, default: Date.now },
});
