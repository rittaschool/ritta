import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsRepository } from './threads.repository';

describe('ThreadsRepository', () => {
  let repository: ThreadsRepository;

  beforeEach(async () => {
    // Create nest testing module for dependency injection
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadsRepository,
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
