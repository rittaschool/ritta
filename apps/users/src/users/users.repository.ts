import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, CreateUserDto } from '@rittaschool/shared';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }

  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove(id).exec();
  }
}
