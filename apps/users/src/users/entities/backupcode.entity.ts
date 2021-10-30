import { Schema, Document } from 'mongoose';
import { BackupCode } from '@rittaschool/shared';

export type BackupCodeDocument = BackupCode & Document;

export const BackupCodeSchema = new Schema({
  code: String,
  used: { type: Boolean, default: false },
});
