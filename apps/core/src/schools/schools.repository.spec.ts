import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SchoolsRepository } from './schools.repository';

describe('SchoolsRepository', () => {
  let repository: SchoolsRepository;

  beforeEach(async () => {
    // Create nest testing module for dependency injection
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolsRepository,
        {
          provide: getModelToken('School'),
          useValue: {},
        },
      ],
    }).compile();

    // Assign the repository to a variable
    repository = module.get<SchoolsRepository>(SchoolsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
