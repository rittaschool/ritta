import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateInstanceDto,
  Instance,
  DeleteWithIdDto,
} from '@rittaschool/shared';
import { Model } from 'mongoose';
import { UpdateInstanceDto } from './dto/update-instance.dto';
import { InstanceDocument } from './entities/instance.entity';

@Injectable()
export class InstancesRepository {
  constructor(
    @InjectModel(Instance.name) private instanceModel: Model<InstanceDocument>,
  ) {}

  async findAll(): Promise<Instance[]> {
    return this.instanceModel.find().exec();
  }

  async findOne(id: string): Promise<Instance> {
    return this.instanceModel.findOne({ id }).exec();
  }

  async create(createInstanceDto: CreateInstanceDto): Promise<Instance> {
    try {
      const createdInstance = new this.instanceModel(createInstanceDto);
      return createdInstance.save();
    } catch (error) {
      throw new Error('Failed saving instance to database: ' + error.message);
    }
  }

  async update(updateInstanceDto: UpdateInstanceDto): Promise<Instance> {
    const doc = await this.findOne(updateInstanceDto.id);
    const newDoc = {
      ...doc,
      ...updateInstanceDto,
    };
    const res = await this.instanceModel.updateOne(doc, newDoc).exec();
    return {
      ...doc,
      ...res,
    };
  }

  async delete(deleteInstanceId: DeleteWithIdDto): Promise<Instance> {
    const doc = await this.findOne(deleteInstanceId.id);

    if (!doc) {
      throw new Error('Instance not found!');
    }

    try {
      this.instanceModel.deleteOne(doc).exec();
      return doc;
    } catch (error) {
      throw new Error(error);
    }
  }
}
