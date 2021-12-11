import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DateScalar, EmailAddressScalar, PhoneNumberScalar } from './scalars';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
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
            queue: 'main-queue',
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
  exports: ['EVENT_BUS', 'LOGGER'],
})
export class CommonModule {}
