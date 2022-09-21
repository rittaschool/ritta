import { Test, TestingModule } from '@nestjs/testing';
import { RecipientsController } from './recipients.controller';

describe('RecipientsController', () => {
  let controller: RecipientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipientsController],
    }).compile();

    controller = module.get<RecipientsController>(RecipientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
