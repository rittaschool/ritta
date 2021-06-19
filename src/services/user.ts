import argon2 from 'argon2';
import { UserModel, AccountModel, TeacherModel, StudentModel } from '../models';
import { decrypt, generateJWT, validateJWT } from '../utils';

export default class UserService {
  public static async createUser(username: string, firstName: string, lastName: string, password: string): Promise<any> {
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
      accounts: userRecord.accounts,
    }
  }

  public static async changePassword(token, oldPassword, newPassword) {
    try {
      const data = validateJWT(token);
      if (data.type !== 'access') {
        throw new Error('Token is not a access token.')
      }
      const userRecord = await UserModel.findById(data.id);
      if (!userRecord) {
        throw new Error('Token user not found.')
      }
      if (data.iat < (userRecord.lastestPasswordChange / 1000)) {
        throw new Error('The JWT is expired')
      }

      const passwordCorrect = await argon2.verify(decrypt(userRecord.password), oldPassword);
      if (!passwordCorrect) {
        throw new Error('Incorrect password')
      }
      userRecord.password = await argon2.hash(newPassword);
      await userRecord.save();
      
      const accessToken = generateJWT({
        type: 'access',
        id: userRecord._id,
        username: userRecord.username,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        accounts: userRecord.accounts,
      }, '1h');

      const refreshToken = generateJWT({
        type: 'refresh',
        id: userRecord._id
      }, '90d');

      return {
        accessToken,
        refreshToken
      }
    } catch (err) {
      throw err;
    }
  }
  public static async createAccount(firstName: string, lastName: string, userType?: number): Promise<any> {
    const userRecord = await AccountModel.create({
      firstName,
      lastName,
      userType
    });
    
    return {
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      userType: userRecord.userType
    }
  }

  public static async createTeacher(firstName: string, lastName: string, titles?: [string]): Promise<any> {
    const start = Date.now()
    const userRecord = await TeacherModel.create({
      firstName,
      lastName,
      titles
    });
    console.log(`Created teacher took ${Date.now()-start}`)
    return {
      // MAKE SURE TO NEVER SEND BACK THE PASSWORD!!!!
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      titles: userRecord.titles,
      abbrevation: userRecord.abbrevation
    }
  }

  public static async createStudent(firstName: string, lastName: string): Promise<any> {
    const userRecord = await StudentModel.create({
      firstName,
      lastName
    });
    
    return {
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
    }
  }
}