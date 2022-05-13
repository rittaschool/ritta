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
    const requiredPermissions = this.reflector.get<number[] | number>(
      'permissions',
      context.getHandler(),
    );

    //console.log('req', request);

    //console.log('requiredPermissions', requiredPermissions);

    if (!requiredPermissions) {
      return true;
    }

    let perms: number;

    if (requiredPermissions instanceof Array) {
      perms = requiredPermissions[0];
    }

    const userPerms = request[0].permissions;

    console.log(userPerms);

    const doesUserHavePermission = Permissions.checkHasPermission(
      perms,
      userPerms,
    );

    if (!doesUserHavePermission) {
      throw new UnauthorizedException('Invalid permissions.');
    }

    return doesUserHavePermission;
  }
}
