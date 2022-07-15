import { Module } from '@nestjs/common';
import { Fido2Controller } from './fido2.controller';
import { Fido2Service } from './fido2.service';
import { Fido2 } from './fido2.utils';

@Module({
  imports: [],
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
