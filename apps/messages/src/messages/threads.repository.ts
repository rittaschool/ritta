import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, NewThreadDto, Thread } from '@rittaschool/shared';
import { Model } from 'mongoose';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ThreadDocument } from './entities/thread.entity';

@Injectable()
export class ThreadsRepository {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
  ) {}

  async findAll(dereference = true): Promise<Thread[]> {
    return (await this.threadModel.find().exec()).map((thread) => {
      if (dereference) {
        thread = thread.toObject();
        delete thread._id;
        delete thread.__v;
      }

      return thread as unknown as Thread;
    });
  }

  async findOne(id: string, dereference = true): Promise<Thread> {
    let thread = await this.threadModel
      .findOne({ $or: [{ id }, { email: id }, { username: id }] })
      .exec();

    if (dereference) {
      thread = thread.toObject();
      delete thread._id;
      delete thread.__v;
    }
    return thread as unknown as Thread;
  }

  async create(
    newThreadDto: NewThreadDto,
    dereference = true,
  ): Promise<Thread> {
    try {
      const createdThread = new this.threadModel(newThreadDto);
      let thread = await createdThread.save();
      if (dereference) {
        thread = thread.toObject();
        delete thread._id;
        delete thread.__v;
      }
      return thread as unknown as Thread;
    } catch (error) {
      throw new Error('Failed saving thread to database');
    }
  }

  async update(
    threadId: string,
    updateThreadDto: UpdateThreadDto,
  ): Promise<Thread> {
    const doc = await this.findOne(threadId);
    doc.messages = doc.messages.map((message: Message | string) => {
      if (typeof message !== 'string') {
        return (message as any).id;
      }
      return message;
    });
    if (updateThreadDto.messages)
      updateThreadDto.messages = updateThreadDto.messages.map(
        (message: Message | string) => {
          if (typeof message !== 'string') {
            return (message as any).id;
          }
          return message;
        },
      );
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
      throw new Error('Thread not found!');
    }

    try {
      this.threadModel.deleteOne(doc).exec();
      return doc;
    } catch (error) {
      throw new Error(error);
    }
  }
}
