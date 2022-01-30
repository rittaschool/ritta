import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { generateRID } from './rid.generator';

@Injectable()
export class RidInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    switch (context.getType() as any) {
      case 'http':
        context.switchToHttp().getRequest().rid = generateRID();
        break;

      case 'graphql':
        context.getArgByIndex(2).rid = generateRID();
        break;

      default:
        break;
    }

    return next.handle();
  }
}
