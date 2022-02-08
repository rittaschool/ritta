import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CustomContext } from './graphql-ctx';
import { UsersModule } from './users/users.module';
import { validate } from './validation/env.validation';
import { ChallengeModule } from './challenge/challenge.module';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './guards/user.guard';
import { RidGuard } from './guards/rid.guard';
import { Tokenizer } from './validation/tokenizer';
import { GqlUserGuard } from './gql-user.guard';
import { PermissionsGuard } from './permissions.guard.';

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
      context: ({ request, reply }: CustomContext) => ({
        request,
        reply,
      }),
    }),
    UsersModule,
    AuthModule,
    ChallengeModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      provide: 'TOKENIZER',
      useClass: Tokenizer,
    },
    {
      provide: APP_GUARD,
      useClass: RidGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GqlUserGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
