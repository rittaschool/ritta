import mongoose from 'mongoose';
interface Account extends mongoose.Document {
    firstName: string;
    lastName: string;
    userType: number;
    student?: mongoose.ObjectId;
    teacher?: mongoose.ObjectId;
}
declare const _default: mongoose.Model<Account, {}, {}>;
export default _default;
