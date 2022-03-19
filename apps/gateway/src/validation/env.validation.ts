import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  PROVISION = 'provision',
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

  @IsString()
  @IsOptional()
  SERVER_IP: string;

  @IsString()
  REDIS_URI: string;

  @IsString()
  JWT_SIGNING_SECRET: string;

  @IsString()
  FRONTEND_PUBLIC_URL: string;
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
