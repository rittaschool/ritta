import { SetMetadata } from '@nestjs/common';

export const NoAuth = () => SetMetadata('noAuth', true);
