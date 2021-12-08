import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';

import { validate } from './validation/env.validation';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    CommonModule,
    GraphQLModule.forRoot({
      playground: true,
      debug: true,
      typePaths: ['./**/*.graphql'],
      introspection: true,
    }),
    UsersModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
