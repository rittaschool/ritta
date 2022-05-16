import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsRepository } from './announcements.repository';

describe('AnnouncementsRepository', () => {
  let repository: AnnouncementsRepository;

  beforeEach(async () => {
    // Create nest testing module for dependency injection
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsRepository,
        {
          provide: getModelToken('Announcement'),
          useValue: {},
        },
      ],
    }).compile();

    // Assign the repository to a variable
    repository = module.get<AnnouncementsRepository>(AnnouncementsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
