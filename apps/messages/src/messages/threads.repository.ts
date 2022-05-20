import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NewThreadDto, Thread } from '@rittaschool/shared';
import { Model } from 'mongoose';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ThreadDocument } from './entities/thread.entity';

@Injectable()
export class ThreadsRepository {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
  ) {}

  async findAll(): Promise<Thread[]> {
    return this.threadModel.find().exec();
  }

  async findOne(id: string): Promise<Thread> {
    return this.threadModel
      .findOne({ $or: [{ id }, { email: id }, { username: id }] })
      .exec();
  }

  async create(newThreadDto: NewThreadDto): Promise<Thread> {
    try {
      const createdMessage = new this.threadModel(newThreadDto);
      return createdMessage.save();
    } catch (error) {
      throw new Error('Failed saving user to database');
    }
  }

  async update(updateThreadDto: UpdateThreadDto): Promise<Thread> {
    const doc = await this.findOne(updateThreadDto.id);
    const newDoc = {
      ...doc,
      ...updateThreadDto,
    };
    const res = await this.threadModel.updateOne(doc, newDoc).exec();
    return {
      ...doc,
      ...res,
    };
  }

  async delete(id: string): Promise<Thread> {
    const doc = await this.findOne(id);

    if (!doc) {
      throw new Error('User not found!');
    }

    try {
      this.threadModel.deleteOne(doc).exec();
      return doc;
    } catch (error) {
      throw new Error(error);
    }
  }
}
