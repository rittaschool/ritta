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
    return this.userModel
      .findOne({ $or: [{ id }, { email: id }, { username: id }] })
      .exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    } catch (error) {
      throw new Error('Failed saving user to database');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const doc = await this.findOne(id);
    const newDoc = {
      ...doc,
      ...updateUserDto,
    };
    const res = await this.userModel.updateOne(doc, newDoc).exec();
    return {
      ...doc,
      ...res,
    };
  }

  async delete(id: string): Promise<User> {
    const doc = await this.findOne(id);

    if (!doc) {
      throw new Error('User not found!');
    }

    try {
      this.userModel.deleteOne(doc).exec();
      return doc;
    } catch (error) {
      throw new Error(error);
    }
  }
}
