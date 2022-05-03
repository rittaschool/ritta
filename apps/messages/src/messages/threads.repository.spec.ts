import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MessagesRepository } from './messages.repository';
import { ThreadsRepository } from './threads.repository';

describe('MessagesRepository', () => {
  let repository: ThreadsRepository;

  beforeEach(async () => {
    // Create nest testing module for dependency injection
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesRepository,
        {
          provide: getModelToken('Thread'),
          useValue: {},
        },
      ],
    }).compile();

    // Assign the repository to a variable
    repository = module.get<ThreadsRepository>(ThreadsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
