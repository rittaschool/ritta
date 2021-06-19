import mongoose from 'mongoose';
interface Student extends mongoose.Document {
    firstName: string;
    lastName: string;
}
declare const _default: mongoose.Model<Student, {}, {}>;
export default _default;
