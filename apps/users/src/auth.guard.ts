import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
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
    const requiredPermissions: number = this.reflector.get<number[]>(
      'permissions',
      context.getHandler(),
    )[0];

    const userPerms = request[0].permissions;

    const doesUserHavePermission = Permissions.checkHasPermission(
      requiredPermissions,
      userPerms,
    );

    if (!doesUserHavePermission) {
      throw new RpcException('Invalid permissions.');
    }

    return doesUserHavePermission;
  }
}
