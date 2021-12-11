import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('LOGGER') private readonly logger: Logger) {}

  use(req: any, res: any, next: () => void) {
    next();
  }
}
