import { TerminusModule } from '@nestjs/terminus';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CustomContext } from './graphql-ctx';
import { UsersModule } from './users/users.module';
import { validate } from './validation/env.validation';
import { ChallengeModule } from './challenge/challenge.module';
import { UserGuard } from './guards/user.guard';
import { RidGuard } from './guards/rid.guard';
import { Tokenizer } from './validation/tokenizer';
import { GqlUserGuard } from './gql-user.guard';
import { HealthController } from './health/health.controller';
import { PermissionsGuard } from './permissions.guard.';
import { MicroserviceHealthIndicator } from './health/rmq.health';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Fido2Controller } from './fido2/fido2.controller';
import { Fido2Module } from './fido2/fido2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    CommonModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
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
    TerminusModule,
    Fido2Module,
  ],
  controllers: [
    AppController,
    AuthController,
    HealthController,
    Fido2Controller,
  ],
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
    MicroserviceHealthIndicator,
  ],
})
export class AppModule {}
