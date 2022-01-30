import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Permissions } from '@rittaschool/shared';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Return true if the request is allowed to passthrough
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.getArgs();
    const requiredPermissions: number = this.reflector.get<number>(
      'permissions',
      context.getHandler(),
    );

    const requiredPerms = Permissions.getPermissions(requiredPermissions);
    const userPerms = Permissions.getPermissions(request[0].permissions);

    // TODO: switch to shared library method checkHasPermission
    const doesUserHavePermission = requiredPerms.every((element) =>
      userPerms.includes(element),
    );

    if (!doesUserHavePermission) {
      throw new RpcException('Invalid credentials.');
    }

    return doesUserHavePermission;
  }
}
