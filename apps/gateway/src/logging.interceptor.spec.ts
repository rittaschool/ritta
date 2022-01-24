import { Test, TestingModule } from '@nestjs/testing';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'LOGGING_INTERCEPTOR',
          useClass: LoggingInterceptor,
        },
        {
          provide: 'LOGGER',
          useValue: {},
        },
      ],
    }).compile();

    interceptor = module.get<LoggingInterceptor>('LOGGING_INTERCEPTOR');
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
