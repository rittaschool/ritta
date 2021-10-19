import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { validate } from './validation/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'SOME_SERVICE',
      useFactory: (configService: ConfigService) => {
        const pass = configService.get('RMQ_PASSWORD');
        const user = configService.get('RMQ_USERNAME');
        const host = configService.get('RMQ_HOST');
        const port = configService.get('RMQ_PORT');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${pass}:${user}@${host}:${port}/`],
            queue: 'gateway_queue',
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    AppService,
  ],
})
export class AppModule {}
