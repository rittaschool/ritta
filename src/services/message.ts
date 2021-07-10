import {
  MessageModel,
  MessageThreadModel,
  UserModel,
  AccountModel,
  TeacherModel,
  AnnouncementModel,
  SchoolModel,
} from '../models';
import mongoose from 'mongoose';
import { decrypt, encrypt, validateAuthJWT } from '../utils';

export default class MessageService {
  public static async searchRecipients(
    token: string,
    accountId: string,
    query: string
  ) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const accountsList = await AccountModel.find({});
    const teachers = Promise.all(
      accountsList.map(async (account) => {
        return await TeacherModel.findById(account.teacher);
      })
    );
    const accounts = accountsList.filter((account, index) => {
      const teacher = teachers[index];
      return (
        !userRecord.accounts.includes(account.id) &&
        (account.firstName.startsWith(query) ||
          account.lastName.startsWith(query) ||
          (teacher && teacher.abbrevation.startsWith(query)) ||
          (teacher && teacher.titles.find((title) => title.startsWith(query))))
      );
    });
    return await Promise.all(
      accounts.map(async (account) => {
        const teacher = await TeacherModel.findById(account.teacher);
        return {
          id: account._id,
          userType: account.userType,
          firstName: account.firstName,
          lastName: account.lastName,
          abbrevation: teacher?.abbrevation,
          titles: teacher?.titles,
        };
      })
    );
  }

  public static async startThread(
    token: string,
    accountId: string,
    name: string,
    content: string,
    recipients: string[] = [],
    draft = false
  ): Promise<any> {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    // Removing duplicates and removing self, if present.
    const recipientsSet = new Set(recipients);
    recipientsSet.delete(accountId);

    if (recipientsSet.size == 0 && !draft) {
      throw new Error('Recipients cannot be empty.');
    }
    // Create thread

    const message = await MessageModel.create({
      sender: accountId,
      content: encrypt(content),
    });
    const messageThread = await MessageThreadModel.create({
      name: encrypt(name),
      sender: {
        userId: accountId,
        archived: false,
      },
      messages: [message],
      recipients: [...recipientsSet].map((userId) => {
        return {
          userId,
          archived: false,
        };
      }),
      draft,
    });

    await message.save();
    await messageThread.save();

    return {
      success: true,
      threadId: messageThread.id,
      messageId: message.id,
    };
  }

  public static async editDraft(
    token: string,
    accountId: string,
    threadId: string,
    content: string,
    recipients: string[]
  ) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const messageThread = await MessageThreadModel.findById(threadId);
    if (!messageThread) {
      throw new Error('Thread not found');
    }
    if (messageThread.sender.userId.toString() !== accountId) {
      throw new Error('Thread not found');
    }
    if (!messageThread.draft) {
      throw new Error('Thread is not a draft');
    }
    const message = await MessageModel.findById(messageThread.messages[0]);
    message.content = encrypt(content);
    await message.save();
    const recipientsSet = new Set(recipients);
    recipientsSet.delete(accountId);
    messageThread.recipients = [...recipientsSet].map((userId) => {
      return {
        userId,
        archived: false,
      };
    });
    await messageThread.save();
    return {
      success: true,
    };
  }

  public static async publishDraft(
    token: string,
    accountId: string,
    threadId: string
  ) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const messageThread = await MessageThreadModel.findById(threadId);
    if (!messageThread) {
      throw new Error('Thread not found');
    }
    if (messageThread.sender.userId.toString() !== accountId) {
      throw new Error('Thread not found');
    }
    if (!messageThread.draft) {
      throw new Error('Thread is not a draft');
    }
    if (messageThread.recipients.length == 0) {
      throw new Error('Recipients cannot be empty.');
    }
    messageThread.draft = false;
    await messageThread.save();
    return {
      success: true,
    };
  }

  public static async sendReplyToThread(
    token: string,
    accountId: string,
    threadId: string,
    content: string
  ): Promise<any> {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const messageThread = await MessageThreadModel.findById(threadId);
    if (!messageThread) {
      throw new Error('Thread not found');
    }
    if (
      !messageThread.recipients.find(
        (recipient) => recipient.userId.toString() === accountId
      ) &&
      messageThread.sender.userId.toString() !== accountId
    ) {
      throw new Error('Thread not found');
    }
    const message = await MessageModel.create({
      sender: accountId,
      content: encrypt(content),
    });
    messageThread.messages.push(message.id);

    await message.save();
    await messageThread.save();

    return {
      success: true,
      threadId: messageThread.id,
      messageId: message.id,
    };
  }

  // Gives list of available messages.
  public static async getThreads(
    token: string,
    accountId: string,
    folder = 'inbox'
  ) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    let threads = [];
    switch (folder) {
      case 'sent':
        threads = await MessageThreadModel.find({
          'sender.userId': mongoose.Types.ObjectId(accountId),
          draft: false,
        });
        break;
      case 'draft':
        threads = await MessageThreadModel.find({
          'sender.userId': mongoose.Types.ObjectId(accountId),
          draft: true,
        });
        break;
      case 'archive':
        threads = await MessageThreadModel.find({
          'recipients.userId': mongoose.Types.ObjectId(accountId),
          'recipients.archived': true,
        });
        break;
      default:
        threads = await MessageThreadModel.find({
          'recipients.userId': accountId,
          draft: false,
        });
        break;
    }
    // Fetch senders
    const sendersCache = {};
    await Promise.all(
      threads.map(async (thread) => {
        const account = await AccountModel.findById(thread.sender.userId);
        sendersCache[thread.sender.userId] = {
          firstName: account.firstName,
          lastName: account.lastName,
        };
        if (account.userType === 3) {
          // Teacher
          sendersCache[thread.sender.userId].abbrevation = (
            await TeacherModel.findById(account.teacher)
          ).abbrevation;
        }
      })
    );
    return await Promise.all(
      threads.map(async (thread) => {
        let newMessages = false;
        const messages = await MessageModel.find({
          _id: { $in: thread.messages },
        });
        messages.forEach((message) => {
          if (!message.seenBy.includes(accountId)) {
            newMessages = true;
            return;
          }
        });
        return {
          id: thread.id,
          name: decrypt(thread.name),
          sender: sendersCache[thread.sender.userId],
          created: thread.created,
          newMessages,
        };
      })
    );
  }

  public static async getThread(
    token: string,
    accountId: string,
    threadId: string
  ) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const messageThread = await MessageThreadModel.findById(threadId);
    if (!messageThread || messageThread.draft) {
      // Drafts can be fetched with getDraft
      throw new Error('Thread not found');
    }
    if (
      !messageThread.recipients.find(
        (recipient) => recipient.userId.toString() === accountId
      ) &&
      messageThread.sender.userId.toString() !== accountId
    ) {
      throw new Error('Thread not found');
    }
    const messages = await MessageModel.find({
      _id: { $in: messageThread.messages },
    });
    const sendersCache = {};
    await Promise.all(
      messages.map(async (message) => {
        const account = await AccountModel.findById(message.sender);
        sendersCache[message.sender] = {
          id: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
        };
        if (account.userType === 3) {
          // Teacher
          sendersCache[message.sender].abbrevation = (
            await TeacherModel.findById(account.teacher)
          ).abbrevation;
        }
      })
    );
    return {
      name: decrypt(messageThread.name),
      sender: sendersCache[messageThread.sender.userId], // First message is author, is set
      messages: messages.map((message) => {
        return {
          sender: sendersCache[message.sender],
          created: message.created,
          content: decrypt(message.content),
        };
      }),
      created: messageThread.created,
    };
  }

  public static async getDraft(
    token: string,
    accountId: string,
    threadId: string
  ) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const messageThread = await MessageThreadModel.findById(threadId);
    if (!messageThread || !messageThread.draft) {
      // Non-drafts can be fetched with getThread
      throw new Error('Thread not found');
    }
    if (messageThread.sender.userId.toString() !== accountId) {
      throw new Error('Thread not found');
    }
    const messages = await MessageModel.find({
      _id: { $in: messageThread.messages },
    });
    const sendersCache = {};
    await Promise.all(
      messages.map(async (message) => {
        const account = await AccountModel.findById(message.sender);
        sendersCache[message.sender] = {
          firstName: account.firstName,
          lastName: account.lastName,
        };
        if (account.userType === 3) {
          // Teacher
          sendersCache[message.sender].abbrevation = (
            await TeacherModel.findById(account.teacher)
          ).abbrevation;
        }
      })
    );
    return {
      name: decrypt(messageThread.name),
      sender: sendersCache[messageThread.sender.userId], // First message is author, is set
      messages: messages.map((message) => {
        return {
          sender: sendersCache[message.sender],
          created: message.created,
          content: decrypt(message.content),
        };
      }),
      created: messageThread.created,
    };
  }

  public static async markThreadRead(
    token: string,
    accountId: string,
    threadId: string
  ): Promise<any> {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const messageThread = await MessageThreadModel.findById(threadId);
    if (!messageThread) {
      throw new Error('Thread not found');
    }
    if (
      !messageThread.recipients.find(
        (recipient) => recipient.userId.toString() === accountId
      ) &&
      messageThread.sender.userId.toString() !== accountId
    ) {
      throw new Error('Thread not found');
    }
    const messages = await MessageModel.find({
      _id: { $in: messageThread.messages },
    });

    await Promise.all(
      messages.map(async (message) => {
        const seenBy = new Set(message.seenBy);
        seenBy.add(accountId);
        message.seenBy = [...seenBy];
        await message.save();
      })
    );

    return {
      success: true,
      threadId: messageThread.id,
    };
  }

  public static async markThreadUnread(
    token: string,
    accountId: string,
    threadId: string
  ): Promise<any> {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const messageThread = await MessageThreadModel.findById(threadId);
    if (!messageThread) {
      throw new Error('Thread not found');
    }
    if (
      !messageThread.recipients.find(
        (recipient) => recipient.userId.toString() === accountId
      ) &&
      messageThread.sender.userId.toString() !== accountId
    ) {
      throw new Error('Thread not found');
    }
    const messages = await MessageModel.find({
      _id: { $in: messageThread.messages },
    });

    await Promise.all(
      messages.map(async (message) => {
        const index = message.seenBy.indexOf(accountId);
        if (index === -1) {
          return;
        }
        message.seenBy.splice(index, 1);
        await message.save();
      })
    );

    return {
      success: true,
      threadId: messageThread.id,
    };
  }

  public static async archiveThread(
    token: string,
    accountId: string,
    threadId: string
  ): Promise<any> {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const messageThread = await MessageThreadModel.findById(threadId);
    if (!messageThread) {
      throw new Error('Thread not found');
    }
    const recipient = messageThread.recipients.find(
      (recipient) => recipient.userId.toString() === accountId
    );
    if (!recipient && messageThread.sender.userId.toString() === accountId) {
      // Sender archive
      if (messageThread.sender.archived) {
        throw new Error('Thread already archived');
      }
      messageThread.sender.archived = true;
      messageThread.markModified('sender.archived');
      await messageThread.save();
      return {
        success: true,
        threadId: messageThread.id,
      };
    }
    if (!recipient) {
      throw new Error('Thread not found');
    }
    if (recipient.archived) {
      throw new Error('Thread already archived');
    }
    recipient.archived = true;
    await messageThread.save();
    return {
      success: true,
      threadId: messageThread.id,
    };
  }

  public static async unArchiveThread(
    token: string,
    accountId: string,
    threadId: string
  ): Promise<any> {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const messageThread = await MessageThreadModel.findById(threadId);
    if (!messageThread) {
      throw new Error('Thread not found');
    }
    const recipient = messageThread.recipients.find(
      (recipient) => recipient.userId.toString() === accountId
    );
    if (!recipient && messageThread.sender.userId.toString() !== accountId) {
      // Sender archive
      if (!messageThread.sender.archived) {
        throw new Error('Thread is not archived');
      }
      messageThread.sender.archived = false;
      messageThread.markModified('sender.archived');
      await messageThread.save();
      return {
        success: true,
        threadId: messageThread.id,
      };
    }
    if (!recipient) {
      throw new Error('Thread not found');
    }
    if (!recipient.archived) {
      throw new Error('Thread is not archived');
    }
    recipient.archived = false;
    await messageThread.save();
    return {
      success: true,
      threadId: messageThread.id,
    };
  }

  // Announcements

  public static async newAnnouncement(
    token: string,
    accountId: string,
    name: string,
    content: string,
    isPublic: boolean,
    forTeachers: boolean,
    forStaff: boolean,
    forStudents: boolean,
    forParents: boolean,
    schoolId?: string
  ) {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    if (isPublic) {
      forTeachers = false;
      forStudents = false;
      forParents = false;
      forStaff = false;
    }
    if (
      !isPublic &&
      (!forTeachers || !forStudents || !forParents || !forStaff)
    ) {
      throw new Error('No recipients selected');
    }
    const school = await SchoolModel.findById(schoolId);
    const announcement = await AnnouncementModel.create({
      name,
      sender: accountId,
      content,
      public: isPublic,
      forStaff,
      forStudents,
      forTeachers,
      forParents,
      school: school?.id,
    });

    await announcement.save();

    return {
      success: true,
      announcementId: announcement.id,
    };
  }

  public static async getAnnouncements(
    token: string,
    accountId: string
  ): Promise<any> {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const account = await AccountModel.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    const announcements = await AnnouncementModel.find({});
    return await Promise.all(
      announcements
        .filter((announcement) => {
          if (announcement.public) return true;
          if (
            announcement.school &&
            account.school &&
            announcement.school !== account.school
          )
            return false;
          switch (account.userType) {
            case 1:
              if (!announcement.forStudents) return false;
              break;
            case 2:
              if (!announcement.forParents) return false;
              break;
            case 3:
              if (!announcement.forTeachers) return false;
              break;
            case 4:
            case 5:
            case 6:
            case 7:
              if (!announcement.forStaff) return false;
              break;
            default:
              return true;
          }
        })
        .map(async (announcement) => {
          const sender = await AccountModel.findById(announcement.sender);
          return {
            id: announcement.id,
            name: announcement.name,
            content: announcement.content,
            sender:
              sender.userType === 100
                ? 'Ylläpitäjä'
                : `${sender.firstName} ${sender.lastName}`,
          };
        })
    );
  }

  public static async getAnnouncement(
    token: string,
    accountId: string,
    announcementId: string
  ): Promise<any> {
    const data = await validateAuthJWT(token);
    const userRecord = await UserModel.findById(data.id);
    if (!userRecord.accounts.includes(accountId)) {
      throw new Error('User does not own account');
    }
    const announcement = await AnnouncementModel.findById(announcementId);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    const account = await AccountModel.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    if (!announcement.public) {
      // Check if user is a recipient.
      if (announcement.school && announcement.school !== account.school) {
        throw new Error('Announcement not found');
      }
      switch (account.userType) {
        case 1:
          if (!announcement.forStudents)
            throw new Error('Announcement not found');
          break;
        case 2:
          if (!announcement.forParents)
            throw new Error('Announcement not found');
          break;
        case 3:
          if (!announcement.forTeachers)
            throw new Error('Announcement not found');
          break;
        case 4:
        case 5:
        case 6:
        case 7:
          if (!announcement.forStaff) throw new Error('Announcement not found');
          break;
        default:
          break;
      }
    }
    const sender = await AccountModel.findById(announcement.sender);
    const school = await SchoolModel.findById(announcement.school);
    return {
      name: announcement.name,
      sender:
        sender.userType === 100
          ? 'Ylläpitäjä'
          : `${sender.firstName} ${sender.lastName}`,
      content: announcement.content,
      public: announcement.public,
      forTeachers: announcement.forTeachers,
      forStaff: announcement.forStaff,
      forStudents: announcement.forStudents,
      forParents: announcement.forParents,
      school: {
        name: school.name,
        id: school.id,
      },
      created: announcement.created,
    };
  }
}
