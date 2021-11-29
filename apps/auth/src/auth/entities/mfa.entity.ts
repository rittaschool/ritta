import { Schema, Document } from 'mongoose';
import { MFAOptions } from '@rittaschool/shared';
import { BackupCodeSchema } from './backupcode.entity';

export type MfaDocument = MFAOptions & Document;

export const MFASchema = new Schema({
  enabled: {
    type: Boolean,
    default: false,
    required: true,
  },
  secret: { type: String, required: true },
  backupCodes: [BackupCodeSchema],
});
