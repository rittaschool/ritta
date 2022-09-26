import { Account } from '@rittaschool/shared';
import { Document, Schema } from 'mongoose';
import { v4 } from 'uuid';

export type AccountDocument = Account & Document;

export const AccountSchema = new Schema({
  id: { type: String, default: v4, required: true, index: true },
  type: { type: Number, default: 1 },
  permissions: { type: Number, default: 0 },
});
