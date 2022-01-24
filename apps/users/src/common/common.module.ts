import { Logger, Module } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  providers: [
    {
      provide: 'LOGGER',
      useClass: Logger,
    },
    LoggingInterceptor,
  ],
  exports: ['LOGGER', LoggingInterceptor],
})
export class CommonModule {}
