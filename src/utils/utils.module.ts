import { Module } from '@nestjs/common';
import { Cryptor } from './encryption';

@Module({
  providers: [Cryptor],
})
export class UtilsModule {}
