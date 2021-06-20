// Message in a thread.

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface Message extends mongoose.Document {
  sender: string;
}

const message = new mongoose.Schema<Message>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  }, 
  created: { 
    type: Number, 
    default: Date.now
  },
  content: { 
    type: String,
    required: true
  },
  seenBy: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    }],
    default: []
  }
});

message.plugin(uniqueValidator);

export default mongoose.model<Message>('Message', message);