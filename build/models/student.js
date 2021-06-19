// Info about a student.
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const student = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    }
});
student.plugin(uniqueValidator);
export default mongoose.model('Student', student);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvc3R1ZGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3QkFBd0I7QUFFeEIsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sZUFBZSxNQUFNLDJCQUEyQixDQUFDO0FBT3hELE1BQU0sT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBVTtJQUN6QyxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7Q0FDSixDQUFDLENBQUM7QUFFSCxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRWhDLGVBQWUsUUFBUSxDQUFDLEtBQUssQ0FBVSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMifQ==