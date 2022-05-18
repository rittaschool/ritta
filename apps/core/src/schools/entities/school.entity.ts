import { School } from '@rittaschool/shared';
import { Schema, Document } from 'mongoose';
import { v4 } from 'uuid';

export type SchoolDocument = School & Document;

export const SchoolSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: v4,
    index: true,
  },
  schoolId: String,
  name: { type: String, required: true },
  emaiil: String,
  phoneNumber: String,
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true },
  },
  principals: {
    type: [
      {
        name: { type: String, required: true },
        title: String,
        phoneNumber: String,
        email: String,
      },
    ],
    required: true,
  },
  secretaries: {
    type: [
      {
        name: { type: String, required: true },
        title: String,
        phoneNumber: String,
        email: String,
      },
    ],
    required: true,
  },
  educationTypes: {
    type: [String],
    required: true,
  },
  allowedAuthMethods: {
    type: [String],
    required: true,
  },
  features: {
    type: [Number],
    required: true,
  },
  lessonInfo: {
    length: { type: Number, required: true },
    lessonTimes: {
      type: [
        {
          start: { type: String, required: true },
          end: { type: String, required: true },
        },
      ],
      required: true,
    },
  },
});
