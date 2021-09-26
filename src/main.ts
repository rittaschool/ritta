import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = 3000;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // API Versioning, appends v? to the url
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger (The Nest.Js way for API Documentation)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ritta API')
    .setDescription('The Ritta API documentation')
    .setVersion('1.0.0')
    .addTag('ritta')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    customSiteTitle: 'Ritta API - Documentation',
  });

  // Start the app
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on http://${'localhost'}:${PORT}`);
  });
}
bootstrap();
