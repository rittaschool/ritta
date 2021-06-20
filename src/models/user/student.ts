// Info about a student.

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface Student extends mongoose.Document {
  firstName: string;
  lastName: string;
}

const student = new mongoose.Schema<Student>({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    }
});

student.plugin(uniqueValidator);

export default mongoose.model<Student>('Student', student);