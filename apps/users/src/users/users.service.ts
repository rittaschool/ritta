import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto, IUser } from '@rittaschool/shared';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const tmpUser: Partial<IUser> = createUserDto;

    // Checking that user has email or username
    if (!tmpUser.email && !tmpUser.username) {
      console.log('email || username missing');
      throw new RpcException('Email or username is required');
    }

    // Checking that user does not exist
    const possibleUser = await this.findOne(
      tmpUser.email || tmpUser.username,
      false,
    );

    if (possibleUser) {
      throw new RpcException('User already exists!');
    }

    // // Hash the password
    // tmpUser.password = await argon2.hash(tmpUser.password, {
    //   type: argon2.argon2id,
    // });

    tmpUser.mfa = {
      secret: '1',
      enabled: false,
      backupCodes: [
        {
          code: 'thisisabackupcode',
          used: false,
        },
      ],
    };

    // Check if user has email and not username, then sets username to email
    if (!tmpUser.username && tmpUser.email) {
      tmpUser.username = tmpUser.email;
    }

    try {
      return this.usersRepository.create(createUserDto);
    } catch (error) {
      throw new RpcException('Failed');
    }
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string, throwError = true) {
    const user = await this.usersRepository.findOne(id);

    if (!user && throwError) {
      throw new RpcException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const current = await this.usersRepository.findOne(id);

    if (current.password !== updateUserDto.password) {
      // Hash the new password.
      updateUserDto.password = await argon2.hash(updateUserDto.password, {
        type: argon2.argon2id,
      });
    }
    // TODO: Make updateUserDto validation and add logic here
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.usersRepository.delete(id);
  }
}
