// Contains an account (student, parent, staff). One user can have multiple of these.
// If user type is "student" or "parent" field "student" has to be set (contains models/student)
// If user type is "teacher" field "teacher" has to be set (contains models/teacher)
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface Account extends mongoose.Document {
  firstName: string;
  lastName: string;
  userType: number;
  student?: string;
  teacher?: string;
}

const account = new mongoose.Schema<Account>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userType: {
    type: Number,
    default: 0,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
});

account.plugin(uniqueValidator);

export default mongoose.model<Account>('Account', account);
