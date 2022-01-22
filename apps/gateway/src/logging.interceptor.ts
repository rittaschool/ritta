import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let path: string;
    let payload: any = {};

    const type = context.getType();

    switch (type as any) {
      case 'http':
        path = context.switchToHttp().getRequest().url;
        break;

      case 'graphql':
        path = `/${context.getArgByIndex(3).fieldName}`;
        payload = context.getArgByIndex(1);
        break;

      default:
        path = context.getType();
        break;
    }

    //const { rid, ...payload } = context.switchToRpc().getData();

    const now = Date.now();

    return next.handle().pipe(
      tap(() =>
        this.logger.log({
          context: 'LoggingInterceptor',
          level: 'info',
          message: `[${Date.now() - now}ms] [${type}] ${path} ${
            payload && JSON.stringify(payload)
          }`,
        }),
      ),
    );
  }
}
