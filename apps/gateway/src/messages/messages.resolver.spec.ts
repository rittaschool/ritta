import { Test, TestingModule } from '@nestjs/testing';
import { MessagesResolver } from './messages.resolver';

describe('MessagesResolver', () => {
  let resolver: MessagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'MESSAGES_RESOLVER', useClass: MessagesResolver },
        { provide: 'MESSAGES_SERVICE', useValue: {} },
        {
          provide: 'LOGGER',
          useValue: {},
        },
        {
          provide: 'TOKENIZER',
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<MessagesResolver>('MESSAGES_RESOLVER');
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
