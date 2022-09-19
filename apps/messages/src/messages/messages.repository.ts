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

  async findAll(dereference = true): Promise<Message[]> {
    return (await this.messageModel.find().exec()).map((message) => {
      if (dereference) {
        message = message.toObject();
        delete message._id;
        delete message.__v;
      }

      return message as unknown as Message;
    });
  }

  async findOne(id: string, dereference = true): Promise<Message> {
    let message = await this.messageModel.findOne({ id }).exec();
    if (dereference) {
      message = message.toObject();
      delete message._id;
      delete message.__v;
    }
    return message as unknown as Message;
  }

  async create(
    newMessageDto: NewMessageDto,
    dereference = true,
  ): Promise<Message> {
    try {
      const createdMessage = new this.messageModel(newMessageDto);
      let message = await createdMessage.save();
      if (dereference) {
        message = message.toObject();
        delete message._id;
        delete message.__v;
      }
      return message as unknown as Message;
    } catch (error) {
      throw new Error('Failed saving message to database: ' + error.message);
    }
  }

  async update(
    messageId: string,
    editMessageDto: EditMessageDto,
  ): Promise<Message> {
    const doc = await this.findOne(messageId);
    const newDoc = {
      ...doc,
      ...editMessageDto,
      content: editMessageDto.newContent || doc.content,
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
