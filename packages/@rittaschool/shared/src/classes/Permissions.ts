import { Permission } from "../enums";
import { IErrorType, RittaError } from "../";
export namespace Permissions {
  export const permissions: Record<string, Permission> = {
    getAllUsers: Permission.GET_ALL_USERS,
    disableLogin: Permission.DISABLE_LOGIN,
    disableRegister: Permission.DISABLE_REGISTER,
    disableUser: Permission.DISABLE_USER,
    disableRole: Permission.DISABLE_ROLE,
    installPlugin: Permission.INSTALL_PLUGIN,
    uninstallPlugin: Permission.UNINSTALL_PLUGIN,
    enableLogin: Permission.ENABLE_LOGIN,
    enableRegister: Permission.ENABLE_REGISTER,
    enableUser: Permission.ENABLE_USER,
    enableRole: Permission.ENABLE_ROLE,
  };

  export function getPermissions(
    permissions: number,
    throwErr: boolean = true
  ) {
    if (permissions === 0 && throwErr)
      throw new RittaError(
        "Too small permission number",
        IErrorType.INVALID_PERMISSION
      );

    const result = [];

    for (const permission in Permissions.permissions) {
      if (permissions & Permissions.permissions[permission]) {
        result.push(permission);
      }
    }

    return result;
  }

  export function addPermissions(
    permissions: number,
    ...permissionsToAdd: Permission[]
  ) {
    const currentPermissions = Permissions.getPermissions(permissions, false);

    for (const permission of permissionsToAdd) {
      if (currentPermissions.includes(Permissions.getPermission(permission))) {
        throw new RittaError(
          "Permission has already been added",
          IErrorType.PERMISSION_IS_ALREADY_ADDED
        );
      }

      permissions |= permission;
    }

    return permissions;
  }

  export function removePermissions(
    permissions: number,
    ...permissionsToRemove: Permission[]
  ) {
    const currentPermissions = Permissions.getPermissions(permissions);
    for (const permission of permissionsToRemove) {
      if (!currentPermissions.includes(Permissions.getPermission(permission))) {
        throw new RittaError(
          "Permission has not been added",
          IErrorType.PERMISSION_NOT_FOUND
        );
      }

      permissions &= ~permission;
    }

    return permissions;
  }

  export function getPermission(permission: number) {
    const res = Object.entries(Permissions.permissions).find(
      ([_, v]) => v === permission
    );

    if (res) {
      return res[0];
    }

    throw new RittaError(
      `Invalid Permission, code: ${permission}`,
      IErrorType.INVALID_PERMISSION
    );
  }

  export function checkHasPermission(
    requiredPermissions: number,
    checkFrom: number
  ) {
    const requiredPerms = Permissions.getPermissions(requiredPermissions);
    const permsToCheckFor = Permissions.getPermissions(checkFrom);

    const doesUserHavePermission = requiredPerms.every((element) =>
      permsToCheckFor.includes(element)
    );

    return doesUserHavePermission;
  }
}
