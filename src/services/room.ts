import { AccountModel, UserModel } from '../models';
import { validateAuthJWT } from '../utils';

export default class RoomService {
  public static async listReservations(
    token: string,
    accountId: string
  ): Promise<any> {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const account = await AccountModel.findById(accountId);
    return [];
    // TODO/WIP
  }
}
