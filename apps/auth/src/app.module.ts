import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './validation/env.validation';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { Fido2Module } from './fido2/fido2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    AuthModule,
    CommonModule,
    Fido2Module,
  ],
  providers: [],
})
export class AppModule {}
