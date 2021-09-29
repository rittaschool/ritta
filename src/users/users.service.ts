import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { Cryptor } from '../utils/encryption';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RandomString } from '../utils/randomString';

export interface FilteredUser
  extends Omit<
    User,
    'password' | 'secret' | 'mfaBackup' | 'mfaSecret' | 'yubiPIN' | 'yubikeyId'
  > {
  id: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cryptor: Cryptor,
    private randomString: RandomString,
  ) {}

  async create({
    password,
    firstName,
    lastName,
  }: CreateUserDto): Promise<FilteredUser> {
    const hashed = this.cryptor.encrypt(
      await argon2.hash(password || '', { hashLength: 20 }),
    );

    const record = await this.userModel.create({
      password: hashed,
      secret: this.randomString.generate(),
      username: firstName.toLowerCase() + '.' + lastName.toLowerCase(),
      firstName,
      lastName,
    });

    const user = await this.filterUser(record);

    return user;
  }

  async findAll(filter = true): Promise<FilteredUser[] | User[]> {
    const userDocs = await this.userModel.find().exec();

    if (filter) {
      const users: FilteredUser[] = [];

      userDocs.map(async (user) => {
        const filUser = await this.filterUser(user);

        users.push(filUser);
      });

      return users;
    }

    return userDocs.map((user) => user.toObject());
  }

  async findOne(
    identifier: string,
    filter = true,
  ): Promise<User | FilteredUser> {
    let user = await this.userModel.findOne({
      $or: [
        {
          _id: identifier,
        },
        {
          username: identifier,
        },
      ],
    });

    if (filter) {
      return await this.filterUser(user);
    } else {
      return user.toObject() as User;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async filterUser(user: UserDocument): Promise<FilteredUser> {
    const filteredUser = user.toObject();

    delete filteredUser.password;
    delete filteredUser.secret;
    delete filteredUser.mfaBackup;
    delete filteredUser.mfaSecret;
    delete filteredUser.yubiPIN;
    delete filteredUser.yubikeyId;
    delete filteredUser.__v;
    delete filteredUser.id;

    filteredUser['id'] = filteredUser['_id'];

    delete filteredUser._id;

    return filteredUser as unknown as Promise<FilteredUser> & { id: string };
  }
}
