import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientProxy } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bus = app.get<ClientProxy>('EVENT_BUS');
  await bus.connect().catch((err) => console.log(err));
  await app.listen(process.env.PORT, () => console.log(`Gateway is online`));
}
bootstrap();
