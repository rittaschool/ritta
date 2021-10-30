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
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  // Initialize APP with fastify framework (default: express)
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Microservices message broker
  const bus = app.get<ClientProxy>('EVENT_BUS');
  try {
    await bus.connect();
  } catch (error) {}

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Ritta')
    .setDescription('Ritta Description')
    .setVersion('0.0.1')
    .addTag('ritta')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Enable api versioning with type uri
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: 'v1',
  });

  // Start server
  await app.listen(process.env.PORT, process.env.SERVER_IP || '0.0.0.0', () =>
    console.log(`Gateway is online`),
  );
}
bootstrap();
