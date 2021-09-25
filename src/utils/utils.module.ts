import { Module } from '@nestjs/common';
import { Cryptor } from './encryption';
import { RandomString } from './randomString';

@Module({
  providers: [Cryptor, RandomString],
  exports: [Cryptor, RandomString],
})
export class UtilsModule {}
