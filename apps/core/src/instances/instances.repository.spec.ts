import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { InstancesRepository } from './instances.repository';

describe('InstancesRepository', () => {
  let repository: InstancesRepository;

  beforeEach(async () => {
    // Create nest testing module for dependency injection
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstancesRepository,
        {
          provide: getModelToken('Instance'),
          useValue: {},
        },
      ],
    }).compile();

    // Assign the repository to a variable
    repository = module.get<InstancesRepository>(InstancesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
