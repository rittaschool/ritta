import fcm from 'node-gcm';
import { NotificationDeviceModel } from '../models';
import { validateAuthJWT } from '../utils';
import config from '../config';
import logger from '../logger';

export default class UserService {
  public static async registerDevice(
    token: string,
    fcmKey: string
  ): Promise<any> {
    const data = await validateAuthJWT(token);

    if (await NotificationDeviceModel.findOne({ fcmKey, user: data.id })) {
      throw new Error('FCM Key is already used on this account');
    }

    const device = await NotificationDeviceModel.create({
      fcmKey,
      user: data.id,
    });

    await device.save();

    return {
      success: true,
    };
  }

  public static async removeDevice(
    token: string,
    fcmKey: string
  ): Promise<any> {
    const data = await validateAuthJWT(token);

    if (
      await NotificationDeviceModel.findOneAndDelete({ fcmKey, user: data.id })
    ) {
      return {
        success: true,
      };
    } else {
      throw new Error('FCM Key is not used');
    }
  }

  public static async sendNotification(target: any, message: fcm.Message) {
    if (typeof target === 'string') {
      target = [target];
    }
    if (!config.fcm.enabled) return; // FCM not enabled
    const sender = new fcm.Sender(config.fcm.serverKey);
    sender.send(message, { registrationTokens: target }, (err, response) => {
      if (err) logger.error(err);
      else logger.info(response);
    });
  }
}
