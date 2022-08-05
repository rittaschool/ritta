import { Inject, Injectable } from '@nestjs/common';
import {
  GetThreadsDto,
  IErrorType,
  IMessage,
  IThread,
  IThreadFolders,
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

  getUserId(token) {
    return (
      this.tokenizer.verify(token) as {
        permissions: number;
        uid: string;
      }
    ).uid;
  }

  async getThreads(
    token: string,
    getThreadsDto: GetThreadsDto,
  ): Promise<Thread[]> {
    const userId = this.getUserId(token);
    // TODO: do after auth and decorators have been finished.
    const allThreads = await this.threadsRepository.findAll();
    let threads = [];
    switch (getThreadsDto?.folder || IThreadFolders.INBOX) {
      case IThreadFolders.OUTBOX:
        threads = allThreads.filter((thread) => {
          return false;
        });
        break;
      case IThreadFolders.DRAFTS:
        threads = allThreads.filter((thread) => {
          return false;
        });
        break;
      case IThreadFolders.ARCHIVE:
        threads = allThreads.filter((thread) => {
          return false;
        });
        break;
      case IThreadFolders.INBOX:
      default:
        threads = allThreads.filter((thread) => {
          return true;
        });
        break;
    }
    return threads;
  }

  async createThread(
    token: string,
    createThreadDto: NewThreadDto,
  ): Promise<Thread> {
    const userId = this.getUserId(token);
    const tmpThread: Partial<IThread> = createThreadDto;

    tmpThread.sender = {
      id: userId,
      archived: false,
    };
    tmpThread.removed = false;
    tmpThread.created = Date.now();
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

    return newThread;
  }
}
