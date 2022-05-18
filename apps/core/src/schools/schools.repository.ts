import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteWithIdDto, School } from '@rittaschool/shared';
import { CreateSchoolDto } from '@rittaschool/shared/src';
import { Model } from 'mongoose';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolDocument } from './entities/school.entity';

@Injectable()
export class SchoolsRepository {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
  ) {}

  async findAll(): Promise<School[]> {
    return this.schoolModel.find().exec();
  }

  async findOne(id: string): Promise<School> {
    return this.schoolModel.findOne({ id }).exec();
  }

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    try {
      const createdSchool = new this.schoolModel(createSchoolDto);
      return createdSchool.save();
    } catch (error) {
      throw new Error('Failed saving school to database: ' + error.message);
    }
  }

  async update(updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const doc = await this.findOne(updateSchoolDto.id);
    const newDoc = {
      ...doc,
      ...updateSchoolDto,
    };
    const res = await this.schoolModel.updateOne(doc, newDoc).exec();
    return {
      ...doc,
      ...res,
    };
  }

  async delete(deleteSchoolId: DeleteWithIdDto): Promise<School> {
    const doc = await this.findOne(deleteSchoolId.id);

    if (!doc) {
      throw new Error('School not found!');
    }

    try {
      this.schoolModel.deleteOne(doc).exec();
      return doc;
    } catch (error) {
      throw new Error(error);
    }
  }
}
