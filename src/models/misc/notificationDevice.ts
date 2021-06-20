// User that logs in.
// Account's also have names on top users.

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface NotificationDevice extends mongoose.Document {
  user: string;
  fcmKey: string;
}

const notificationDevice = new mongoose.Schema<NotificationDevice>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fcmKey: {
    type: String,
    required: true,
  },
});

notificationDevice.plugin(uniqueValidator);

export default mongoose.model<NotificationDevice>(
  'NotificationDevice',
  notificationDevice
);
