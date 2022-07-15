import { config } from 'dotenv';
import { createService } from 'framework';
import { AppModule } from './app.module';
config();

async function bootstrap() {
  const app = await createService({
    name: 'users',
    queue: {
      name: 'users',
      url: `amqp://${process.env.RMQ_PASSWORD}:${process.env.RMQ_USERNAME}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/`,
      options: {
        durable: true,
      },
    },
    appModule: AppModule,
  });

  app.start();
}
bootstrap();
