import mongoose from 'mongoose';
interface User extends mongoose.Document {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    accounts: [mongoose.ObjectId];
    latestLogin: number;
}
declare const _default: mongoose.Model<User, {}, {}>;
export default _default;
