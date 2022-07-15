import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'framework';

import { AuthModule } from './auth/auth.module';
import { Fido2Module } from './fido2/fido2.module';
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
  ],
  providers: [],
})
export class AppModule {}
