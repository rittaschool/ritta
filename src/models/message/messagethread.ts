// Thread that contains messages

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface MessageThread extends mongoose.Document {
  name: string;
  sender: string;
  recipients: [
    {
      userId: string;
      archived: boolean;
    }
  ];
  messages: [string];
  created: number;
}

const messageThread = new mongoose.Schema<MessageThread>({
  name: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  recipients: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      archived: {
        type: Boolean,
        default: false,
      },
    },
  ],
  messages: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true,
      },
    ],
    default: [],
  }, // All messages tied to this thread
  created: { type: Number, default: Date.now },
});

messageThread.plugin(uniqueValidator);

export default mongoose.model<MessageThread>('MessageThread', messageThread);
