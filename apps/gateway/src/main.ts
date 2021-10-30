import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientProxy } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const bus = app.get<ClientProxy>('EVENT_BUS');
  await bus
    .connect()
    .catch(() => console.log('Error connecting to RabbitMQ, Reconnecting...'));
  await app.listen(process.env.PORT, process.env.SERVER_IP || '0.0.0.0', () =>
    console.log(`Gateway is online`),
  );
}
bootstrap();
