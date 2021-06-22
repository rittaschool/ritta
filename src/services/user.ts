import argon2 from 'argon2';
import { UserModel, AccountModel, TeacherModel, StudentModel } from '../models';
import { decrypt, encrypt, validateAuthJWT } from '../utils';

export default class UserService {
  public static async createUser(
    username: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<any> {
    const passwordHashed = encrypt(await argon2.hash(password));

    const userRecord = await UserModel.create({
      password: passwordHashed,
      username,
      firstName,
      lastName,
    });

    return {
      username: userRecord.username,
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      accounts: userRecord.accounts,
    };
  }

  public static async changePassword(token, oldPassword, newPassword) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    const passwordCorrect = await argon2.verify(
      decrypt(userRecord.password),
      oldPassword
    );
    if (!passwordCorrect) {
      throw new Error('Incorrect password');
    }
    userRecord.password = encrypt(await argon2.hash(newPassword));
    userRecord.lastestPasswordChange = Date.now();
    await userRecord.save();

    return {
      success: true,
    };
  }

  public static async listAccounts(token: string) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    const accounts = await Promise.all(
      userRecord.accounts.map(async (accountId) => {
        const accountInfo = await AccountModel.findById(accountId);
        return {
          id: accountId,
          firstName: accountInfo.firstName,
          lastName: accountInfo.lastName,
          userType: accountInfo.userType,
        };
      })
    );
    return accounts;
  }

  public static async createAccount(
    firstName: string,
    lastName: string,
    userType?: number
  ): Promise<any> {
    const userRecord = await AccountModel.create({
      firstName,
      lastName,
      userType,
    });

    return {
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      userType: userRecord.userType,
    };
  }

  public static async createTeacher(
    firstName: string,
    lastName: string,
    titles?: string[]
  ): Promise<any> {
    const userRecord = await TeacherModel.create({
      firstName,
      lastName,
      titles,
    });
    return {
      // MAKE SURE TO NEVER SEND BACK THE PASSWORD!!!!
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      titles: userRecord.titles,
      abbrevation: userRecord.abbrevation,
    };
  }

  public static async createStudent(
    firstName: string,
    lastName: string
  ): Promise<any> {
    const userRecord = await StudentModel.create({
      firstName,
      lastName,
    });

    return {
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
    };
  }
}
