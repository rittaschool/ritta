import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@rittaschool/shared';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    // Checking that user has email or username
    if (!createUserDto.email && !createUserDto.username) {
      throw new Error('Email or username is required');
    }
    return this.usersRepository.create(createUserDto);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // TODO: Make updateUserDto validation and add logic here
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
