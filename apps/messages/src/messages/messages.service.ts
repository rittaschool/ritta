import { Inject, Injectable } from '@nestjs/common';
import {
  GetThreadsDto,
  IErrorType,
  IMessage,
  IThread,
  IThreadFolders,
  Message,
  NewMessageDto,
  NewThreadDto,
  RittaError,
  Thread,
} from '@rittaschool/shared';
import { Tokenizer } from 'src/tokenizer';
import { MessagesRepository } from './messages.repository';
import { ThreadsRepository } from './threads.repository';
import { v4 } from 'uuid';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('THREADS_REPOSITORY') private threadsRepository: ThreadsRepository,
    @Inject('TOKENIZER') private tokenizer: Tokenizer,
    @Inject('MESSAGES_REPOSITORY')
    private messagesRepository: MessagesRepository,
  ) {}

  async getUserId(token) {
    return (
      (await this.tokenizer.verify(token)) as {
        permissions: number;
        uid: string;
      }
    ).uid;
  }

  async getThreads(
    token: string,
    getThreadsDto: GetThreadsDto,
  ): Promise<Thread[]> {
    const userId = await this.getUserId(token);
    // TODO: do after auth and decorators have been finished.
    const allThreads = await this.threadsRepository.findAll();
    let threads: Thread[] = [];
    switch (getThreadsDto?.folder || IThreadFolders.INBOX) {
      case IThreadFolders.OUTBOX:
        threads = allThreads.filter(
          (thread) =>
            !thread.removed &&
            !thread.sender.archived &&
            thread.sender.id === userId,
        );
        break;
      case IThreadFolders.DRAFTS:
        threads = allThreads.filter(
          (thread) =>
            !thread.removed && thread.sender.id === userId && thread.draft,
        );
        break;
      // TODO: add support for groups
      case IThreadFolders.ARCHIVE:
        threads = allThreads.filter((thread) => {
          if (thread.removed) return false;
          if (thread.sender.id === userId) return thread.sender.archived;
          if (thread.recipients.find((r) => r.id === userId))
            return thread.recipients.find((r) => r.id === userId).archived;
          return false;
        });
        break;
      case IThreadFolders.INBOX:
      default:
        threads = allThreads.filter((thread) => {
          if (thread.removed) return false;
          if (thread.sender.id === userId) return !thread.sender.archived;
          if (thread.recipients.find((r) => r.id === userId))
            return !thread.recipients.find((r) => r.id === userId).archived;
          return false;
        });
        break;
    }
    // Because the DB Schema only includes message id's, we translate them to Message objects
    threads = await Promise.all(
      threads.map(async (thread) => {
        thread.messages = await Promise.all(
          thread.messages.map(
            async (messageId: Message | string): Promise<Message> => {
              return messageId instanceof Message
                ? messageId
                : await this.messagesRepository.findOne(messageId);
            },
          ),
        );
        return thread;
      }),
    );
    return threads;
  }

  async createThread(
    token: string,
    createThreadDto: NewThreadDto,
  ): Promise<Thread> {
    const userId = await this.getUserId(token);
    const tmpThread: Partial<IThread> = createThreadDto;

    tmpThread.sender = {
      id: userId,
      archived: false,
    };
    tmpThread.id = v4();

    // Checking message has necessary stuff
    if (!tmpThread.name || !tmpThread.recipients) {
      throw new RittaError(
        'Name and recipients are required!',
        IErrorType.EMAIL_OR_USERNAME_REQUIRED,
      );
    }

    if (tmpThread.recipients.length <= 0) {
      throw new RittaError(
        'Recipients cannot be empty!',
        IErrorType.EMAIL_OR_USERNAME_REQUIRED,
      );
    }

    const firstMessage: NewMessageDto = {
      threadId: tmpThread.id,
      content: createThreadDto.content,
      senderId: userId,
      seenBy: [userId],
    };

    let newMessage: IMessage;

    try {
      newMessage = await this.messagesRepository.create(firstMessage);
    } catch (error) {
      throw new RittaError('Error saving thread', IErrorType.UNKNOWN);
    }

    tmpThread.messages = [newMessage.id];

    let newThread: Thread;

    try {
      newThread = await this.threadsRepository.create(createThreadDto);
    } catch (error) {
      console.log(error);
      throw new RittaError('Error saving thread', IErrorType.UNKNOWN);
    }

    return { ...newThread, messages: [newMessage] };
  }

  async markThreadAsRead(token: string, threadId: string) {
    const userId = await this.getUserId(token);
    const thread = await this.threadsRepository.findOne(threadId);
    await Promise.all(
      thread.messages.map(async (messageId: Message | string) => {
        const message = await this.messagesRepository.findOne(
          messageId instanceof Message ? messageId.id : messageId,
        );
        await this.messagesRepository.update(message.id, {
          seenBy: Array.from(new Set(message.seenBy.concat([userId]))),
        } as any);
      }),
    );
    return true;
  }

  async markThreadAsUnread(token: string, threadId: string) {
    const userId = await this.getUserId(token);
    const thread = await this.threadsRepository.findOne(threadId);
    await Promise.all(
      thread.messages.map(async (messageId: Message | string) => {
        const message = await this.messagesRepository.findOne(
          messageId instanceof Message ? messageId.id : messageId,
        );
        await this.messagesRepository.update(message.id, {
          seenBy: Array.from(
            new Set(message.seenBy.filter((seenById) => seenById !== userId)),
          ),
          messageId,
        } as any);
      }),
    );
    return true;
  }
}
