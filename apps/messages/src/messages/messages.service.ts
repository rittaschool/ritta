import { Inject, Injectable } from '@nestjs/common';
import { GetThreadsDto, IThreadFolders, Thread } from '@rittaschool/shared';
import { MessagesRepository } from './messages.repository';
import { ThreadsRepository } from './threads.repository';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('THREADS_REPOSITORY') private threadsRepository: ThreadsRepository,
    @Inject('MESSAGES_REPOSITORY')
    private messagesRepository: MessagesRepository,
  ) {}
  async getThreads(getThreadsDto: GetThreadsDto): Promise<Thread[]> {
    // TODO: do after auth and decorators have been finished.
    const allThreads = await this.threadsRepository.findAll();
    let threads = [];
    switch (getThreadsDto.folder) {
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
      case IThreadFolders.ALL:
        threads = allThreads.filter((thread) => {
          return false;
        });
        break;
      case IThreadFolders.INBOX:
      default:
        threads = allThreads.filter((thread) => {
          return false;
        });
        break;
    }
    return threads;
  }
}
