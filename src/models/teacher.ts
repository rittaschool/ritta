// Info about a teacher.

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const generateAbbrevation = function () { // Function because () => {} resets this!
  return this.lastName.substring(0,3) + this.firstName.substring(0,3) 
}

interface Teacher extends mongoose.Document {
  firstName: string;
  lastName: string;
  titles: [string];
  abbrevation: string;
}

const teacher = new mongoose.Schema<Teacher>({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    titles: {
      type: [{
        type: String,
        required: true,
      }],
      default: []
    },
    abbrevation: {
      type: String,
      default: generateAbbrevation
    }
});

teacher.plugin(uniqueValidator);

export default mongoose.model<Teacher>('Teacher', teacher);