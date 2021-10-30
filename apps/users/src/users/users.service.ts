import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto } from '@rittaschool/shared';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    // Checking that user has email or username
    if (!createUserDto.email && !createUserDto.username) {
      throw new RpcException('Email or username is required');
    }

    // Checking that user does not exist
    const possibleUser = await this.findOne(
      createUserDto.email || createUserDto.username,
      false,
    );

    if (possibleUser) {
      throw new RpcException('User already exists!');
    }

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

  update(id: string, updateUserDto: UpdateUserDto) {
    // TODO: Make updateUserDto validation and add logic here
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
