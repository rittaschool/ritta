import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import {
  ClientProxy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RMQ_PASSWORD}:${process.env.RMQ_USERNAME}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/`,
        ],
        queue: 'main-queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  // Microservices message broker
  const bus = app.get<ClientProxy>('EVENT_BUS');
  try {
    await bus.connect();
  } catch (error) {}

  app.listen().then(() => console.log(`Auth service is online`));
}
bootstrap();
