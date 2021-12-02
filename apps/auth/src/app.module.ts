import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './validation/env.validation';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    AuthModule,
  ],
})
export class AppModule {}
