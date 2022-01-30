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
})
export class CommonModule {}
