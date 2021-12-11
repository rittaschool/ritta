import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { generateRID } from './rid.generator';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('LOGGER') private readonly logger: Logger) {}

  use(req: any, res: any, next: () => void) {
    const rid = generateRID();
    this.logger.log({
      context: 'LoggerMiddleware',
      rid,
      message: `${req.method} ${req.originalUrl || req.url}`,
    });
    req.headers['rid'] = rid;
    next();
  }
}
