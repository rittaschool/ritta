import { Schema, Document } from 'mongoose';
import { Location } from '@rittaschool/shared';

const reqString = {
  type: String,
  required: true,
};

export type LocationDocument = Location & Document;

export const LocationSchema = new Schema({
  address: reqString,
  city: reqString,
  country: reqString,
  zip: reqString,
});
