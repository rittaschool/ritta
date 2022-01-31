import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { generateRID } from '../rid.generator';

@Injectable()
export class RidGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
    return true;
  }
}
