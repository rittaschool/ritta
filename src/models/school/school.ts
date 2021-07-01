// User that logs in.
// Account's also have names on top users.

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface School extends mongoose.Document {
  name: string;
}

const school = new mongoose.Schema<School>({
  name: {
    type: String,
    required: true,
  },
});

school.plugin(uniqueValidator);

export default mongoose.model<School>('School', school);
