import { Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class Tokenizer {
  verify<T>(token: string): T {
    const data = verify(token, process.env.JWT_SIGNING_SECRET);
    return data as T;
  }
}
