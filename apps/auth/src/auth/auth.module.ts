import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule],
  providers: [
    UserService,
    AuthService,
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
  ],
})
export class AuthModule {}
