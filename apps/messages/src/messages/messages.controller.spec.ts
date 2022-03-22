import { Test, TestingModule } from '@nestjs/testing';
import { CoreController } from './messages.controller';

describe('UsersController', () => {
  let controller: CoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [
        {
          provide: 'MESSAGES_SERVICE',
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CoreController>(CoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
