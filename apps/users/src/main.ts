import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
import { AppModule } from './app.module';
import { consoleFormat } from './logger.format';
config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RMQ_PASSWORD}:${process.env.RMQ_USERNAME}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/`,
        ],
        queue: 'users',
        queueOptions: {
          durable: true,
        },
      },
      logger: WinstonModule.createLogger({
        defaultMeta: { service: 'users', enviroment: process.env.NODE_ENV },
        transports: [
          new transports.Console({
            format: consoleFormat,
          }),
          new transports.File({ filename: 'logs/all.log' }),
        ],
      }),
    },
  );

  await app.listen().then(() => {
    app
      .get('LOGGER')
      .log({ message: `Users service is online`, context: 'Main' });
  });
}
bootstrap();
