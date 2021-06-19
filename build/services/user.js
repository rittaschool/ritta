import argon2 from 'argon2';
import { UserModel, AccountModel, TeacherModel, StudentModel } from '../models';
export default class UserService {
    static async createUser(username, firstName, lastName, password) {
        const passwordHashed = await argon2.hash(password);
        const userRecord = await UserModel.create({
            password: passwordHashed,
            username,
            firstName,
            lastName
        });
        return {
            username: userRecord.username,
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
            accounts: userRecord.accounts
        };
    }
    static async createAccount(firstName, lastName, userType) {
        const userRecord = await AccountModel.create({
            firstName,
            lastName,
            userType
        });
        return {
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
            userType: userRecord.userType
        };
    }
    static async createTeacher(firstName, lastName, titles) {
        const start = Date.now();
        const userRecord = await TeacherModel.create({
            firstName,
            lastName,
            titles
        });
        console.log(`Created teacher took ${Date.now() - start}`);
        return {
            // MAKE SURE TO NEVER SEND BACK THE PASSWORD!!!!
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
            titles: userRecord.titles,
            abbrevation: userRecord.abbrevation
        };
    }
    static async createStudent(firstName, lastName) {
        const userRecord = await StudentModel.create({
            firstName,
            lastName
        });
        return {
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRWhGLE1BQU0sQ0FBQyxPQUFPLE9BQU8sV0FBVztJQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFnQixFQUFFLFNBQWlCLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQjtRQUNwRyxNQUFNLGNBQWMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbkQsTUFBTSxVQUFVLEdBQUcsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQ3hDLFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFFBQVE7WUFDUixTQUFTO1lBQ1QsUUFBUTtTQUNULENBQUMsQ0FBQztRQUVILE9BQU87WUFDTCxRQUFRLEVBQUUsVUFBVSxDQUFDLFFBQVE7WUFDN0IsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTO1lBQy9CLFFBQVEsRUFBRSxVQUFVLENBQUMsUUFBUTtZQUM3QixRQUFRLEVBQUUsVUFBVSxDQUFDLFFBQVE7U0FDOUIsQ0FBQTtJQUNILENBQUM7SUFFTSxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFpQixFQUFFLFFBQWdCLEVBQUUsUUFBaUI7UUFDdEYsTUFBTSxVQUFVLEdBQUcsTUFBTSxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQzNDLFNBQVM7WUFDVCxRQUFRO1lBQ1IsUUFBUTtTQUNULENBQUMsQ0FBQztRQUVILE9BQU87WUFDTCxTQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVM7WUFDL0IsUUFBUSxFQUFFLFVBQVUsQ0FBQyxRQUFRO1lBQzdCLFFBQVEsRUFBRSxVQUFVLENBQUMsUUFBUTtTQUM5QixDQUFBO0lBQ0gsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQWlCLEVBQUUsUUFBZ0IsRUFBRSxNQUFpQjtRQUN0RixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDeEIsTUFBTSxVQUFVLEdBQUcsTUFBTSxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQzNDLFNBQVM7WUFDVCxRQUFRO1lBQ1IsTUFBTTtTQUNQLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBQ3ZELE9BQU87WUFDTCxnREFBZ0Q7WUFDaEQsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTO1lBQy9CLFFBQVEsRUFBRSxVQUFVLENBQUMsUUFBUTtZQUM3QixNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU07WUFDekIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxXQUFXO1NBQ3BDLENBQUE7SUFDSCxDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBaUIsRUFBRSxRQUFnQjtRQUNuRSxNQUFNLFVBQVUsR0FBRyxNQUFNLFlBQVksQ0FBQyxNQUFNLENBQUM7WUFDM0MsU0FBUztZQUNULFFBQVE7U0FDVCxDQUFDLENBQUM7UUFFSCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTO1lBQy9CLFFBQVEsRUFBRSxVQUFVLENBQUMsUUFBUTtTQUM5QixDQUFBO0lBQ0gsQ0FBQztDQUNGIn0=