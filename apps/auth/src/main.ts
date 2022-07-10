import { config } from 'dotenv';
import { createService } from 'framework';
import { AppModule } from './app.module';
config();

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: [
  //         `amqp://${process.env.RMQ_PASSWORD}:${process.env.RMQ_USERNAME}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/`,
  //       ],
  //       queue: 'auth',
  //       queueOptions: {
  //         durable: true,
  //       },
  //     },
  //     logger: WinstonModule.createLogger({
  //       defaultMeta: { service: 'users', enviroment: process.env.NODE_ENV },
  //       transports: [
  //         new transports.Console({
  //           format: consoleFormat,
  //         }),
  //         new transports.File({ filename: 'logs/all.log' }),
  //       ],
  //     }),
  //   },
  // );

  // // Bind Logging interceptor
  // app.useGlobalInterceptors(new LoggingInterceptor(app.get('LOGGER')));

  // // Microservices message broker
  // const bus = app.get<ClientProxy>('EVENT_BUS');
  // try {
  //   await bus.connect();
  // } catch (error) {}

  // app
  //   .listen()
  //   .then(() =>
  //     app
  //       .get('LOGGER')
  //       .log({ message: `Auth service is online`, context: 'Main' }),
  //   );

  const app = createService({
    name: 'auth',
    queue: {
      name: 'auth',
      url: `amqp://${process.env.RMQ_PASSWORD}:${process.env.RMQ_USERNAME}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/`,
      options: {
        durable: true,
      },
    },
    appModule: AppModule,
  });

  (await app).start();
}
bootstrap();
