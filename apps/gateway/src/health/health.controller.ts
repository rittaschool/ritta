import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { MicroserviceHealthIndicator } from './rmq.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private ms: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const host = this.configService.get<string>('RMQ_HOST');
    const port = this.configService.get<string>('RMQ_PORT');
    const user = this.configService.get<string>('RMQ_USERNAME');
    const pass = this.configService.get<string>('RMQ_PASSWORD');

    const url = `amqp://${user}:${pass}@${host}:${port}`;

    return this.health.check([
      () =>
        this.ms.pingCheck('core', {
          transport: Transport.RMQ,
          options: {
            urls: [url],
            queue: 'core',
          },
        }),
      () =>
        this.ms.pingCheck('users', {
          transport: Transport.RMQ,
          options: {
            urls: [url],
            queue: 'users',
          },
        }),
      () =>
        this.ms.pingCheck('auth', {
          transport: Transport.RMQ,
          options: {
            urls: [url],
            queue: 'auth',
          },
        }),
    ]);
  }
}
