import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { Fido2Service } from './fido2.service';
import { Fido2Resolver } from './fido2.resolver';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, ConfigModule],
  providers: [
    { provide: 'FIDO2_SERVICE', useClass: Fido2Service },
    Fido2Resolver,
  ],
})
export class Fido2Module {}
