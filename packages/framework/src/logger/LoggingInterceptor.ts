import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject("LOGGER") private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const path = context.getArgs()[1].args[2];
    const { rid, token, ...payload } = context.switchToRpc().getData();

    const now = Date.now();

    return next.handle().pipe(
      tap(() =>
        this.logger.log({
          context: "LoggingInterceptor",
          level: "info",
          rid,
          message: `[${Date.now() - now}ms] ${path} ${JSON.stringify(payload)}`,
        })
      )
    );
  }
}
