import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MESSAGES_SERVICE',
          useClass: MessagesService,
        },
        { provide: 'MESSAGES_BUS', useValue: {} },
        { provide: 'AUTH_BUS', useValue: {} },
        { provide: 'CORE_BUS', useValue: {} },
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

    service = module.get<MessagesService>('MESSAGES_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
