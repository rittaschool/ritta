import { Inject, Injectable } from '@nestjs/common';
import {
  EditMessageDto,
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
  ThreadActionDto,
} from '@rittaschool/shared';
import { Tokenizer } from 'src/tokenizer';
import { MessagesRepository } from './messages.repository';
import { ThreadsRepository } from './threads.repository';
import { v4 } from 'uuid';
import { RpcException } from '@nestjs/microservices';

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
    if (thread.removed) {
      throw new RpcException('Thread has been deleted');
    }
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
    if (thread.removed) {
      throw new RpcException('Thread has been deleted');
    }
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

  async createMessage(token: string, newMessageDto: NewMessageDto) {
    const userId = await this.getUserId(token);
    const thread = await this.threadsRepository.findOne(newMessageDto.threadId);
    if (thread.removed) {
      throw new RpcException('Thread has been deleted');
    }
    const tmpMessage: Partial<IMessage> = newMessageDto;
    tmpMessage.senderId = userId;
    tmpMessage.seenBy = [userId];

    let newMessage: IMessage;

    try {
      newMessage = await this.messagesRepository.create(newMessageDto);
    } catch (error) {
      throw new RittaError('Error saving message', IErrorType.UNKNOWN);
    }

    thread.messages.push(newMessage.id);

    await this.threadsRepository.update(newMessageDto.threadId, {
      messages: thread.messages,
    });

    return newMessage;
  }

  async editMessage(token: string, editMessageDto: EditMessageDto) {
    const userId = await this.getUserId(token);
    const message = await this.messagesRepository.findOne(
      editMessageDto.messageId,
    );

    if (message.senderId !== userId) {
      throw new RpcException('You are not the author of the message');
    }

    await this.messagesRepository.update(
      editMessageDto.messageId,
      editMessageDto,
    );

    return true;
  }

  async publishDraft(token: string, publishDraftDto: ThreadActionDto) {
    const userId = await this.getUserId(token);
    const thread = await this.threadsRepository.findOne(
      publishDraftDto.threadId,
    );

    if (thread.sender.id !== userId) {
      throw new RpcException('You are not the author of the thread');
    }

    if (thread.removed) {
      throw new RpcException('Thread has been deleted');
    }

    if (!thread.draft) {
      throw new RpcException('Thread is not a draft');
    }

    await this.threadsRepository.update(publishDraftDto.threadId, {
      draft: false,
    });

    return true;
  }

  async deleteThread(token: string, deleteThreadDto: ThreadActionDto) {
    const userId = await this.getUserId(token);
    const thread = await this.threadsRepository.findOne(
      deleteThreadDto.threadId,
    );

    if (thread.sender.id !== userId) {
      throw new RpcException('You are not the author of the thread');
    }

    if (thread.removed) {
      throw new RpcException('Thread has been deleted');
    }

    if (thread.messages.length > 1) {
      throw new RpcException('Thread has other messages');
    }

    await this.threadsRepository.update(deleteThreadDto.threadId, {
      removed: true,
    });

    return true;
  }
}
