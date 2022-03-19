import { Module } from '@nestjs/common';
import { Fido2Service } from './fido2.service';
import { Fido2Controller } from './fido2.controller';
import { Fido2 } from './fido2.utils';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: 'FIDO2_SERVICE',
      useClass: Fido2Service,
    },
    {
      provide: 'FIDO2',
      useFactory: () => {
        let rpId = 'code.midka.dev';
        let rpName = 'NestJS';
        let rpIcon = 'https://code.midka.dev/favicon.ico';
        let timeout = 60000;

        return new Fido2(rpId, rpName, rpIcon, timeout);
      },
    },
  ],
  controllers: [Fido2Controller],
})
export class Fido2Module {}
