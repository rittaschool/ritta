import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
import { consoleFormat } from './logger.format';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RMQ_PASSWORD}:${process.env.RMQ_USERNAME}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/`,
        ],
        queue: 'messages',
        queueOptions: {
          durable: true,
        },
      },
      logger: WinstonModule.createLogger({
        defaultMeta: { service: 'messages', enviroment: process.env.NODE_ENV },
        transports: [
          new transports.Console({
            format: consoleFormat,
          }),
          new transports.File({ filename: 'logs/all.log' }),
        ],
      }),
    },
  );

  app
    .listen()
    .then(() => console.log(`Messages service is online`))
    .catch(console.error);
}
bootstrap();
