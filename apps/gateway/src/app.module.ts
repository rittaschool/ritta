import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChallengeModule } from './challenge/challenge.module';
import { CommonModule } from './common/common.module';
import { Fido2Module } from './fido2/fido2.module';
import { CustomContext } from './graphql-ctx';
import { GqlUserGuard } from './guards/gql-user.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RidGuard } from './guards/rid.guard';
import { UserGuard } from './guards/user.guard';
import { HealthController } from './health/health.controller';
import { MicroserviceHealthIndicator } from './health/rmq.health';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { validate } from './validation/env.validation';
import { Tokenizer } from './validation/tokenizer';

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
    MessagesModule,
    ChallengeModule,
    TerminusModule,
    Fido2Module,
  ],
  controllers: [AppController, HealthController],
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
