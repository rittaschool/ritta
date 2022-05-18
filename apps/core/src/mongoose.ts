import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable({ scope: Scope.REQUEST })
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(@Inject(REQUEST) private readonly request) {}

  createMongooseOptions(): MongooseModuleOptions {
    const database = 'tenant_test';

    return {
      uri: process.env.MONGO_URI.replace('{TENANTID}', database),
    };
  }
}
