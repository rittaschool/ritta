// Info about a student.

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface Parent extends mongoose.Document {
  firstName: string;
  lastName: string;
  alias: string;
  home: {
    address: string;
    postal: string;
  };
  phoneNumber: string;
  workNumber?: string;
  email: string;
}

function defaultAlias() {
  return this.firstName;
}

const parent = new mongoose.Schema<Parent>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
    default: defaultAlias,
  },
  home: {
    address: {
      type: String,
      required: true,
    },
    postal: {
      type: String,
      required: true,
    },
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  workNumber: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
});

parent.plugin(uniqueValidator);

export default mongoose.model<Parent>('Parent', parent);
