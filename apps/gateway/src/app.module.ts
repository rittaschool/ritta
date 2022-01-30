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
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { MicroserviceHealthIndicator } from './health/rmq.health';

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
    TerminusModule,
  ],
  controllers: [AppController, AuthController, HealthController],
  providers: [AppService, MicroserviceHealthIndicator],
})
export class AppModule {}
