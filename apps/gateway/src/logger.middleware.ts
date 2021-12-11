import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('LOGGER') private readonly logger: Logger) {}

  use(req: any, res: any, next: () => void) {
    this.logger.log(
      `${req.method} ${req.originalUrl} | ${req.headers['cf-ipcountry']} << ${req.headers['x-forwarded-for']}`,
    );
    this.logger.warn({
      message: 'warn message',
      rid: 'request id for debugging',
    });
    next();
  }
}
