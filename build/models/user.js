// User that logs in.
// Account's also have names on top users.
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    accounts: {
        type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Account',
            }],
        default: []
    },
    latestLogin: {
        type: Date,
        default: Date.now
    }
});
user.plugin(uniqueValidator);
export default mongoose.model('User', user);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQkFBcUI7QUFDckIsMENBQTBDO0FBRTFDLE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUNoQyxPQUFPLGVBQWUsTUFBTSwyQkFBMkIsQ0FBQztBQVd4RCxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQU87SUFDbkMsUUFBUSxFQUFFO1FBQ04sSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRSxJQUFJO0tBQ2Y7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsTUFBTSxFQUFFLElBQUk7S0FDZjtJQUNELFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxDQUFDO2dCQUNMLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO2dCQUNwQyxHQUFHLEVBQUUsU0FBUzthQUNmLENBQUM7UUFDRixPQUFPLEVBQUUsRUFBRTtLQUNaO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLElBQUk7UUFDVixPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUc7S0FDbEI7Q0FDSixDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTdCLGVBQWUsUUFBUSxDQUFDLEtBQUssQ0FBTyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMifQ==