// User that logs in.
// Account's also have names on top users.

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const generateAbbrevation = function () {
  // Function because () => {} resets this!
  return this.name
    .split(' ')
    .reduce((a: string, b: string) => a + b.substring(0, 3), '');
};

interface Room extends mongoose.Document {
  name: string;
  abbrevation: string;
  school: string;
  seats: number;
  extraInfo?: string;
}

const room = new mongoose.Schema<Room>({
  name: {
    type: String,
    required: true,
  },
  abbrevation: {
    type: String,
    default: generateAbbrevation,
  },
  school: {
    type: mongoose.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  seats: {
    type: Number,
    default: 0,
  },
  extraInfo: {
    type: String,
    default: '',
  },
  reservations: {
    type: [
      {
        booker: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'Account',
        },
        startTime: {
          type: Date,
          required: true,
        },
        endTime: {
          type: Date,
          required: true,
        },
      },
    ],
    default: [],
  },
});

room.plugin(uniqueValidator);

export default mongoose.model<Room>('Room', room);
