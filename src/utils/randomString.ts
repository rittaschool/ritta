import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class RandomString {
  generate(length = 32): string {
    return length % 2 === 0
      ? crypto.randomBytes(length / 2).toString('hex')
      : crypto
          .randomBytes(Math.floor(length / 2) + 1)
          .toString('hex')
          .slice(0, -1);
  }
}
