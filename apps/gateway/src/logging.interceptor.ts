import {
  BadGatewayException,
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let path: string;
    let payload: any = {};
    let rid: string;
    let method: string;

    const type = context.getType();

    switch (type as any) {
      case 'http':
        const req = context.switchToHttp().getRequest();
        path = req.url;
        rid = req.rid;
        method = req.method;
        break;

      case 'graphql':
        path = `/${context.getArgByIndex(3).fieldName}`;
        payload = context.getArgByIndex(1);
        rid = context.getArgByIndex(2).rid;
        method = context.getArgByIndex(3).parentType;
        break;

      default:
        path = context.getType();
        break;
    }

    const now = Date.now();

    //TODO: fix so it also logs the message if it fails
    return next.handle().pipe(
      tap(() => {
        logMessage(this.logger, type, method, path, payload, rid, now);
      }),
    );
  }
}

const logMessage = (
  logger: Logger,
  type: string,
  method: string,
  path: string,
  payload: any,
  rid: string,
  now: number,
) => {
  logger.log({
    context: 'LoggingInterceptor',
    level: 'info',
    rid,
    message: `[${Date.now() - now}ms] [${type}/${method}] ${path} ${
      payload && JSON.stringify(payload)
    }`,
  });
};
