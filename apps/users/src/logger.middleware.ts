import { Injectable, NestMiddleware, Inject, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('LOGGER') private readonly logger: Logger) {}

  use(req: any, res: any, next: () => void) {
    // this.logger.log({
    //   context: 'LoggerMiddleware',
    //   rid,
    //   message: `${req.method} ${req.originalUrl || req.url}`,
    // });
    // req.headers['rid'] = rid;
    this.logger.log('logging middleware');
    next();
  }
}
