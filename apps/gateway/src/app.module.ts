import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { validate } from './validation/env.validation';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { DateScalar } from './common/scalars';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
