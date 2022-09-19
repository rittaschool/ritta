import fastifyCookie from '@fastify/cookie';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { config } from 'dotenv';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
import { AppModule } from './app.module';
import { ChallengeService } from './challenge/challenge.service';
import { consoleFormat, fileFormat } from './logger.format';
import { LoggingInterceptor } from './logging.interceptor';
config();

async function bootstrap() {
  // Initialize APP with fastify framework (default: express)
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: WinstonModule.createLogger({
        defaultMeta: { service: 'gateway', enviroment: process.env.NODE_ENV },
        transports: [
          new transports.Console({
            format: consoleFormat,
          }),
          new transports.File({ filename: 'logs/all.log', format: fileFormat }),
        ],
      }),
    },
  );

  app.enableShutdownHooks();

  // Register cookie handler
  // @ts-ignore
  app.register(fastifyCookie, {
    // deepcode ignore HardcodedNonCryptoSecret: it is TODO
    secret: 'my-secret', // for cookies signature //TODO: move to env @raikasdev
  });

  // Microservices message broker
  const bus = app.get<ClientProxy>('USERS_BUS');
  try {
    await bus.connect();
  } catch (error) {}

  const bus2 = app.get<ClientProxy>('AUTH_BUS');
  try {
    await bus2.connect();
  } catch (error) {}

  const bus3 = app.get<ClientProxy>('CORE_BUS');
  try {
    await bus3.connect();
  } catch (error) {}

  const bus4 = app.get<ClientProxy>('MESSAGES_BUS');
  try {
    await bus4.connect();
  } catch (error) {}

  // Enable api versioning with type uri
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Init challenge database
  const challengeService = app.get<ChallengeService>('CHALLENGE_SERVICE');
  await challengeService.init();

  // Bind global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(app.get('LOGGER')));

  // Swagger documentation
  // const config = new DocumentBuilder()
  //   .setTitle('Ritta')
  //   .setDescription('Ritta Description')
  //   .setVersion('0.0.1')
  //   .addTag('ritta')
  //   .build();

  //const document = SwaggerModule.createDocument(app, config);
  //SwaggerModule.setup('docs', app, document);

  // Start server
  await app.listen(process.env.PORT, process.env.SERVER_IP || '0.0.0.0', () =>
    app.get('LOGGER').log({ message: `Gateway is online`, context: 'Main' }),
  );
}
bootstrap();
