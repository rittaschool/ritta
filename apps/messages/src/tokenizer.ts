import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class Tokenizer {
  verify<T>(token: string): T {
    const data = verify(token, process.env.JWT_SIGNING_SECRET);
    return data as T;
  }

  sign(data: string | object | Buffer): string {
    return sign(data, process.env.JWT_SIGNING_SECRET);
  }
}
