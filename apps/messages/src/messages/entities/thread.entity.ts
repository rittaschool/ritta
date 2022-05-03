import { Thread } from '@rittaschool/shared/src/classes';
import { Schema, Document } from 'mongoose';

export type ThreadDocument = Thread & Document;

export const ThreadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sender: {
    type: {
      userId: {
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
        required: true,
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
