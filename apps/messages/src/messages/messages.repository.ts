import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  NewMessageDto,
  EditMessageDto,
  Message,
  DeleteMessageDto,
} from '@rittaschool/shared';
import { Model } from 'mongoose';
import { MessageDocument } from './entities/message.entity';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async findOne(id: string): Promise<Message> {
    return this.messageModel.findOne({ id }).exec();
  }

  async create(newMessageDto: NewMessageDto): Promise<Message> {
    try {
      const createdMessage = new this.messageModel(newMessageDto);
      return createdMessage.save();
    } catch (error) {
      throw new Error('Failed saving message to database: ' + error.message);
    }
  }

  async update(editMessageDto: EditMessageDto): Promise<Message> {
    const doc = await this.findOne(editMessageDto.messageId);
    const newDoc = {
      ...doc,
      content: editMessageDto.newContent,
    };
    const res = await this.messageModel.updateOne(doc, newDoc).exec();
    return {
      ...doc,
      ...res,
    };
  }

  async delete(deleteMessageDto: DeleteMessageDto): Promise<Message> {
    const doc = await this.findOne(deleteMessageDto.messageId);

    if (!doc) {
      throw new Error('Message not found!');
    }

    try {
      this.messageModel.deleteOne(doc).exec();
      return doc;
    } catch (error) {
      throw new Error(error);
    }
  }
}
