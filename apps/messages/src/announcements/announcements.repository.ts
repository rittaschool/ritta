import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  NewMessageDto,
  EditMessageDto,
  DeleteMessageDto,
} from '@rittaschool/shared';
import { Announcement } from '@rittaschool/shared';
import { Model } from 'mongoose';
import { AnnouncementDocument } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsRepository {
  constructor(
    @InjectModel(Announcement.name)
    private announcementModel: Model<AnnouncementDocument>,
  ) {}

  async findAll(): Promise<Announcement[]> {
    return this.announcementModel.find().exec();
  }

  async findOne(id: string): Promise<Announcement> {
    return this.announcementModel.findOne({ id }).exec();
  }

  // TODO: create dto and update this
  async create(newMessageDto: NewMessageDto): Promise<Announcement> {
    try {
      const createdUser = new this.announcementModel(newMessageDto);
      return createdUser.save();
    } catch (error) {
      throw new Error(
        'Failed saving announcement to database: ' + error.message,
      );
    }
  }

  // TODO: create dto and update this
  async update(editMessageDto: EditMessageDto): Promise<Announcement> {
    const doc = await this.findOne(editMessageDto.messageId);
    const newDoc = {
      ...doc,
      content: editMessageDto.newContent,
    };
    const res = await this.announcementModel.updateOne(doc, newDoc).exec();
    return {
      ...doc,
      ...res,
    };
  }

  // TODO: create dto and update this
  async delete(deleteMessageDto: DeleteMessageDto): Promise<Announcement> {
    const doc = await this.findOne(deleteMessageDto.messageId);

    if (!doc) {
      throw new Error('User not found!');
    }

    try {
      this.announcementModel.deleteOne(doc).exec();
      return doc;
    } catch (error) {
      throw new Error(error);
    }
  }
}
