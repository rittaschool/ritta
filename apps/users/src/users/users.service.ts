import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto, IUser } from '@rittaschool/shared';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import encryptUtils from './encrypt';
import generator from './generator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: UsersRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const tmpUser: Partial<IUser> = createUserDto;

    // Checking that user has email or username
    if (!tmpUser.email && !tmpUser.username) {
      console.log('email || username missing');
      throw new RpcException('Email or username is required');
    }

    console.log(1);
    // Checking that user does not exist
    const possibleUser = await this.getUser(
      tmpUser.email || tmpUser.username,
      false,
    );
    console.log(2);
    console.log(possibleUser);
    if (possibleUser) {
      throw new RpcException('User already exists!');
    }
    console.log(22);
    console.log(tmpUser.password);
    // Hash the password
    tmpUser.password = await bcrypt.hash(tmpUser.password, 6);

    console.log(3);
    // These are just placeholders
    tmpUser.mfa = {
      secret: await generator.generateMFASecret(),
      enabled: false,
      backupCodes: [await generator.generateBackupCode()],
    };
    console.log(4);

    try {
      return this.usersRepository.create(createUserDto);
    } catch (error) {
      throw new RpcException('Failed');
    }
  }

  getUsers() {
    return this.usersRepository.findAll();
  }

  async getUser(id: string, throwError = true) {
    const user = await this.usersRepository.findOne(id);

    if (!user && throwError) {
      throw new RpcException('User not found.');
    }

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const current = await this.usersRepository.findOne(updateUserDto.id);

    if (current.password !== updateUserDto.password) {
      // Hash the new password.
      updateUserDto.password = await encryptUtils.encodePassword(
        updateUserDto.password,
      );
    }
    // TODO: Make updateUserDto validation and add logic here
    return this.usersRepository.update(updateUserDto.id, updateUserDto);
  }

  async removeUser(id: string) {
    return await this.usersRepository.delete(id);
  }
}
