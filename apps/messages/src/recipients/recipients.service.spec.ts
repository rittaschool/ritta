import { Test, TestingModule } from '@nestjs/testing';
import { RecipientsService } from './recipients.service';

describe('RecipientsService', () => {
  let service: RecipientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipientsService],
    }).compile();

    service = module.get<RecipientsService>(RecipientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
