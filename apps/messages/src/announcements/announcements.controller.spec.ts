import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsController } from './announcements.controller';

describe('UsersController', () => {
  let controller: AnnouncementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementsController],
      providers: [
        {
          provide: 'ANNOUNCEMENTS_SERVICE',
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AnnouncementsController>(AnnouncementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
