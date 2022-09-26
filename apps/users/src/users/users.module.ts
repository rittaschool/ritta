import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, User } from '@rittaschool/shared';
import { CommonModule } from 'framework';
import { AccountSchema } from './entities/account.entity';
import { UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
    CommonModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: 'USERS_SERVICE',
      useClass: UsersService,
    },
    {
      provide: 'USERS_REPOSITORY',
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
