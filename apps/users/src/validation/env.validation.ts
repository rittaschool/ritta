import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Enviroment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  PROVISION = 'provision',
}

class EnviromentVariables {
  @IsEnum(Enviroment)
  NODE_ENV: Enviroment = Enviroment.DEVELOPMENT;

  @IsString()
  RMQ_HOST: string;

  @IsNumber()
  RMQ_PORT: number;

  @IsString()
  RMQ_USERNAME: string;

  @IsString()
  RMQ_PASSWORD: string;

  @IsString()
  MONGO_URI: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnviromentVariables, config, {
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
