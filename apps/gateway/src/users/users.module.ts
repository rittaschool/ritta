import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [CommonModule],
  providers: [UsersResolver, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
