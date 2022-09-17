import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class Tokenizer {
<<<<<<< HEAD
  verify<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      verify(token, process.env.JWT_SIGNING_SECRET, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data as T);
      });
    });
  }

  sign(data: string | object | Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(data, process.env.JWT_SIGNING_SECRET, {}, (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      });
    });
=======
  verify<T>(token: string): T {
    const data = verify(token, process.env.JWT_SIGNING_SECRET);
    return data as T;
  }

  sign(data: string | object | Buffer): string {
    return sign(data, process.env.JWT_SIGNING_SECRET);
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
  }
}
