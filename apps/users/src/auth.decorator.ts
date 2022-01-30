import { SetMetadata } from '@nestjs/common';
import { Permission } from '@rittaschool/shared';

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);
