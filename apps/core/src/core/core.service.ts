import { Injectable } from '@nestjs/common';
import * as toml from 'toml';
import * as fs from 'fs';

@Injectable()
export class CoreService {
  async getName(): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile('./config/core.toml', 'utf8', async (err, data) => {
        if (err) {
          reject(err);
        }
        const parsed = toml.parse(data);
        resolve(parsed.instance.name);
      });
    });
  }
}
