import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MessagesRepository } from './messages.repository';

describe('MessagesRepository', () => {
  let repository: MessagesRepository;

  beforeEach(async () => {
    // Create nest testing module for dependency injection
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesRepository,
        {
          provide: getModelToken('Message'),
          useValue: {},
        },
      ],
    }).compile();

    // Assign the repository to a variable
    repository = module.get<MessagesRepository>(MessagesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
