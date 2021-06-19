import mongoose from 'mongoose';
interface Teacher extends mongoose.Document {
    firstName: string;
    lastName: string;
    titles: [string];
    abbrevation: string;
}
declare const _default: mongoose.Model<Teacher, {}, {}>;
export default _default;
