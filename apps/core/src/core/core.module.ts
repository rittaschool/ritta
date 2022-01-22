import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CoreController],
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CORE_SERVICE',
      useClass: CoreService,
    },
  ],
})
export class CoreModule {}
