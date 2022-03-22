import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { LoggingInterceptor } from './logging.interceptor';
import { UserService } from './user.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'LOGGER',
      useClass: Logger,
    },
    {
      provide: 'USERS_SERVICE',
      useClass: UserService,
    },
    {
      provide: 'EVENT_BUS',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('RMQ_HOST');
        const port = configService.get<string>('RMQ_PORT');
        const user = configService.get<string>('RMQ_USERNAME');
        const pass = configService.get<string>('RMQ_PASSWORD');

        const url = `amqp://${user}:${pass}@${host}:${port}`;

        return ClientProxyFactory.create({
          options: {
            queue: 'users',
            queueOptions: { durable: true },
            urls: [url],
          },
          transport: Transport.RMQ,
        });
      },
      inject: [ConfigService],
    },
    LoggingInterceptor,
  ],
  exports: ['USERS_SERVICE'],
})
export class CommonModule {}
