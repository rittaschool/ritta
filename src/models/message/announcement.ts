// A single message announcement.

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface Announcement extends mongoose.Document {
  name: string;
  sender: string;
  content: string;
  public: boolean;
  forTeachers: boolean;
  forStaff: boolean;
  forStudents: boolean;
  forParents: boolean;
  school?: string;
  created: number;
}

const announcement = new mongoose.Schema<Announcement>({
  name: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  public: {
    // If the announcement is public for everyone, even people not logged in.
    type: Boolean,
    required: true,
  },
  forTeachers: {
    // If the announcement is public for teachers
    type: Boolean,
    required: true,
  },
  forStaff: {
    // If the announcement is public for other staff members
    type: Boolean,
    required: true,
  },
  forStudents: {
    // If the announcement is public for students
    type: Boolean,
    required: true,
  },
  forParents: {
    // If the announcement is public for parents
    type: Boolean,
    required: true,
  },
  school: {
    // If this announcement is restricted to a certain school.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
  },
  created: { type: Number, default: Date.now },
});

announcement.plugin(uniqueValidator);

export default mongoose.model<Announcement>('Announcement', announcement);
