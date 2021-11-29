import { Schema, Document } from 'mongoose';
import { Oauth2Identifiers } from '@rittaschool/shared';

export type Oauth2Document = Oauth2Identifiers & Document;

export const Oauth2Schema = new Schema({
  opinsys: String,
});
