import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'framework';

import { AuthModule } from './auth/auth.module';
import { Fido2Module } from './fido2/fido2.module';
import { CommonModule } from 'framework';
import { ServicesModule } from './services/services.module';
import { validate } from './validation/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    AuthModule,
    Fido2Module,
    CommonModule,
    ServicesModule,
    LoggerModule,
  ],
  providers: [],
})
export class AppModule {}
