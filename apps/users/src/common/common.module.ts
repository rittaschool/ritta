import { Logger, Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'LOGGER',
      useClass: Logger,
    },
  ],
  exports: ['LOGGER'],
})
export class CommonModule {}
