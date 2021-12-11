import { Logger } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';

describe('LoggingMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggerMiddleware({} as Logger)).toBeDefined();
  });
});
