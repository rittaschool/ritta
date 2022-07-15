import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { LoggerModule } from "../logger/logger.module";

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [
    {
      provide: "EVENT_BUS",
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>("RMQ_HOST");
        const port = configService.get<string>("RMQ_PORT");
        const user = configService.get<string>("RMQ_USERNAME");
        const pass = configService.get<string>("RMQ_PASSWORD");

        const url = `amqp://${user}:${pass}@${host}:${port}`;

        return ClientProxyFactory.create({
          options: {
            queue: "users",
            queueOptions: { durable: true },
            urls: [url],
          },
          transport: Transport.RMQ,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ["EVENT_BUS"],
})
export class CommonModule {}
