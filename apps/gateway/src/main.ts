import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientProxy } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const bus = app.get<ClientProxy>('EVENT_BUS');
  try {
    await bus.connect();
  } catch (error) {}

  const config = new DocumentBuilder()
    .setTitle('Ritta')
    .setDescription('Ritta Description')
    .setVersion('0.0.1')
    .addTag('ritta')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT, process.env.SERVER_IP || '0.0.0.0', () =>
    console.log(`Gateway is online`),
  );
}
bootstrap();
