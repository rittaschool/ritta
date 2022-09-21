import { Test, TestingModule } from '@nestjs/testing';
import { RecipientsResolver } from './recipients.resolver';

describe('RecipientsResolver', () => {
  let resolver: RecipientsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipientsResolver],
    }).compile();

    resolver = module.get<RecipientsResolver>(RecipientsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
