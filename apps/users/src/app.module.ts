import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'framework';
import { PermissionsGuard } from './auth.guard';
import { MongooseConfigService } from './mongoose';
import { Tokenizer } from './tokenizer';
import { UsersModule } from './users/users.module';
import { validate } from './validation/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    UsersModule,
    CommonModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: 'TOKENIZER',
      useClass: Tokenizer,
    },
  ],
})
export class AppModule {}
