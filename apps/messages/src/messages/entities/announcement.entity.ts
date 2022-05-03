import { Announcement } from '@rittaschool/shared';
import { Schema, Document } from 'mongoose';

export type AnnouncementDocument = Announcement & Document;

export const AnnouncementSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  public: {
    type: Boolean,
    required: true,
  },
  forTeachers: {
    type: Boolean,
    required: true,
  },
  forStaff: {
    type: Boolean,
    required: true,
  },
  forStudents: {
    type: Boolean,
    required: true,
  },
  forParents: {
    type: Boolean,
    required: true,
  },
  school: { type: [String], default: [] },
  created: { type: Number, default: Date.now },
});
