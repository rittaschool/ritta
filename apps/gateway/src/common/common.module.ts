import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DateScalar, EmailAddressScalar, PhoneNumberScalar } from './scalars';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'USERS_BUS',
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
    {
      provide: 'AUTH_BUS',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('RMQ_HOST');
        const port = configService.get<string>('RMQ_PORT');
        const user = configService.get<string>('RMQ_USERNAME');
        const pass = configService.get<string>('RMQ_PASSWORD');

        const url = `amqp://${user}:${pass}@${host}:${port}`;

        return ClientProxyFactory.create({
          options: {
            queue: 'auth',
            queueOptions: { durable: true },
            urls: [url],
          },
          transport: Transport.RMQ,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'CORE_BUS',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('RMQ_HOST');
        const port = configService.get<string>('RMQ_PORT');
        const user = configService.get<string>('RMQ_USERNAME');
        const pass = configService.get<string>('RMQ_PASSWORD');

        const url = `amqp://${user}:${pass}@${host}:${port}`;

        return ClientProxyFactory.create({
          options: {
            queue: 'core',
            queueOptions: { durable: true },
            urls: [url],
          },
          transport: Transport.RMQ,
        });
      },
      inject: [ConfigService],
    },
    DateScalar,
    EmailAddressScalar,
    PhoneNumberScalar,
    {
      provide: 'LOGGER',
      useClass: Logger,
    },
  ],
  exports: ['USERS_BUS', 'AUTH_BUS', 'CORE_BUS', 'LOGGER'],
})
export class CommonModule {}
