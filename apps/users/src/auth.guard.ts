import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  IErrorType,
  IUser,
  Permissions,
  RittaError,
} from '@rittaschool/shared';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Return true if the request is allowed to passthrough
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.getArgs();
    const requiredPermissions = this.reflector.get<number[] | number>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    let perms = 0;

    if (requiredPermissions instanceof Array) {
      requiredPermissions.forEach((permission) => {
        perms = Permissions.addPermissions(perms, permission);
      });
    }

    // Got from the request if client has provided a token
    const userPerms = (request[0].user as IUser).permissions;

    if (userPerms > 0) {
      const doesUserHavePermission = Permissions.checkHasPermission(
        perms,
        userPerms,
      );

      if (!doesUserHavePermission) {
        throw new RittaError(
          'Invalid permissions.',
          IErrorType.INVALID_PERMISSION,
        );
      }

      return doesUserHavePermission;
    }

    throw new RittaError('Invalid permissions.', IErrorType.INVALID_PERMISSION);
  }
}
