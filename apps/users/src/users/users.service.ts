import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto } from '@rittaschool/shared';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    console.log('here');
    // Checking that user has email or username
    if (!createUserDto.email && !createUserDto.username) {
      console.log('email || username missing');
      throw new RpcException('Email or username is required');
    }

    console.log(createUserDto);

    // Checking that user does not exist
    const possibleUser = await this.findOne(
      createUserDto.email || createUserDto.username,
      false,
    );

    if (possibleUser) {
      throw new RpcException('User already exists!');
    }

    // Hash the password
    createUserDto.password = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
    });

    return this.usersRepository.create(createUserDto);
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

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
