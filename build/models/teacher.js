// Info about a teacher.
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const generateAbbrevation = function () {
    return this.lastName.substring(0, 3) + this.firstName.substring(0, 3);
};
const teacher = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    titles: {
        type: [{
                type: String,
                required: true,
            }],
        default: []
    },
    abbrevation: {
        type: String,
        default: generateAbbrevation
    }
});
teacher.plugin(uniqueValidator);
export default mongoose.model('Teacher', teacher);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVhY2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdGVhY2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3QkFBd0I7QUFFeEIsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sZUFBZSxNQUFNLDJCQUEyQixDQUFDO0FBRXhELE1BQU0sbUJBQW1CLEdBQUc7SUFDMUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3JFLENBQUMsQ0FBQTtBQVNELE1BQU0sT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBVTtJQUN6QyxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsQ0FBQztnQkFDTCxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmLENBQUM7UUFDRixPQUFPLEVBQUUsRUFBRTtLQUNaO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsbUJBQW1CO0tBQzdCO0NBQ0osQ0FBQyxDQUFDO0FBRUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVoQyxlQUFlLFFBQVEsQ0FBQyxLQUFLLENBQVUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDIn0=