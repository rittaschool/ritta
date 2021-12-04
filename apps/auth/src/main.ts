import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { ClientProxy, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
  );

  // Microservices message broker
  const bus = app.get<ClientProxy>('EVENT_BUS');
  try {
    await bus.connect();
  } catch (error) {}

  app.listen().then(() => console.log(`Auth service is online`));
}
bootstrap();
