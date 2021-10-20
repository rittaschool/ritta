import { plainToClass } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  RMQ_HOST: string;

  @IsNumber()
  RMQ_PORT: number;

  @IsString()
  RMQ_USERNAME: string;

  @IsString()
  RMQ_PASSWORD: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Invalid configuration: ${errors.toString()}`);
  }

  return validatedConfig;
};
