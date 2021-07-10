// Info about a student.

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface Student extends mongoose.Document {
  firstName: string;
  lastName: string;
  alias: string;
  home: {
    address: string;
    postal: string;
  };
  phoneNumber?: string;
  email?: string;
}

function defaultAlias() {
  return this.firstName;
}

const student = new mongoose.Schema<Student>({
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
    type: {
      address: {
        type: String,
        required: true,
      },
      postal: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
});

student.plugin(uniqueValidator);

export default mongoose.model<Student>('Student', student);
