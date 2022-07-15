import { NestFactory } from "@nestjs/core";
import {
  ClientProxy,
  MicroserviceOptions,
  Transport,
} from "@nestjs/microservices";
import { WinstonModule } from "nest-winston";
import { transports } from "winston";
import { App, CreateServiceProps } from "./interfaces";
import { consoleFormat } from "./logger.format";
import { LoggingInterceptor } from "./logger/LoggingInterceptor";

export const createService = async ({
  appModule,
  queue,
  name,
}: CreateServiceProps): Promise<App> => {
  // use provided url or env variables
  const queueUrl: string =
    queue.url ||
    `amqp://${process.env.RMQ_PASSWORD}:${process.env.RMQ_USERNAME}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/`;

  // create nest microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    appModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [queueUrl],
        queue: queue.name,
        queueOptions: queue.options,
      },
      // create logger
      logger: WinstonModule.createLogger({
        defaultMeta: { service: name, enviroment: process.env.NODE_ENV },
        transports: [
          new transports.Console({
            format: consoleFormat,
          }),
          new transports.File({ filename: "logs/all.log" }),
        ],
      }),
    }
  );

  // Connect to message broker
  const bus = app.get<ClientProxy>("EVENT_BUS");
  try {
    await bus.connect();
  } catch (error) {
    app.get("LOGGER").error(error);
  }

  // Use logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor(app.get("LOGGER")));

  // Send INIT event

  // Confirm service is able to start

  return {
    ...app,
    start: () =>
      app
        .listen()
        .then(() =>
          app
            .get("LOGGER")
            .log({ message: `${name} service is online`, context: "Main" })
        ),
  };
};

export { CommonModule } from "./common/common.module";
export { LoggerModule } from "./logger/logger.module";
