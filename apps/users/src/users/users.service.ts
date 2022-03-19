import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  CreateUserDto,
  IErrorType,
  IUser,
  RittaError,
  User,
} from '@rittaschool/shared';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import encryptUtils from './encrypt';
import generator from './generator';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: UsersRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<Res<User>> {
    const tmpUser: Partial<IUser> = createUserDto;

    // Checking that user has email or username
    if (!tmpUser.email && !tmpUser.username) {
      throw new RpcException('Email or username is required');
    }

    if (!tmpUser.username && tmpUser.email) {
      tmpUser.username = tmpUser.email;
    }

    // Checking that user does not exist
    const possibleUser = await this.getUser(tmpUser.username, false);

    if (possibleUser) {
      return {
        error: new RittaError(
          'Käyttäjä on jo olemassa',
          IErrorType.USER_ALREADY_EXISTS,
        ),
      };
    }

    // Hash the password
    tmpUser.password = await encryptUtils.encodePassword(tmpUser.password);

    // These are just placeholders
    tmpUser.mfa = {
      secret: await generator.generateMFASecret(),
      enabled: false,
      backupCodes: [await generator.generateBackupCode()],
    };

    let newUser: User;
    let error: RittaError;

    try {
      newUser = await this.usersRepository.create(createUserDto);
    } catch (error) {
      error = new RittaError(
        'Käyttäjä on jo olemassa',
        IErrorType.USER_ALREADY_EXISTS,
      );
    }

    return {
      data: newUser,
      error,
    };
  }

  async getUsers() {
    return await this.usersRepository.findAll();
  }

  async getUser(id: string, throwError = true) {
    const user = await this.usersRepository.findOne(id);

    if (user == null && throwError) {
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
    return await this.usersRepository.update(updateUserDto.id, updateUserDto);
  }

  async removeUser(id: string) {
    return await this.usersRepository.delete(id);
  }
}

export interface Res<T, E = RittaError> {
  data?: T;
  error?: E;
}
