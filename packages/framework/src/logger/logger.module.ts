import { Logger, Module } from "@nestjs/common";
import { LoggingInterceptor } from "./LoggingInterceptor";

@Module({
  providers: [
    {
      provide: "LOGGER",
      useClass: Logger,
    },
    LoggingInterceptor,
  ],
  exports: ["LOGGER", LoggingInterceptor],
})
export class LoggerModule {}
