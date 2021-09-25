import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { Cryptor } from 'src/utils/encryption';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RandomString } from 'src/utils/randomString';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cryptor: Cryptor,
    private randomString: RandomString,
  ) {}

  async create({
    password,
    username,
    firstName,
    lastName,
  }: CreateUserDto): Promise<User> {
    const hashed = this.cryptor.encrypt(await argon2.hash(password));

    const record = await this.userModel.create({
      password: hashed,
      secret: this.randomString.generate(),
      username,
      firstName,
      lastName,
    });

    record['password'] = 'REDACTED';

    return record;
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
