import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { Cryptor } from 'src/utils/encryption';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RandomString } from 'src/utils/randomString';

export type FilteredUser = Omit<
  User,
  'password' | 'secret' | 'mfaBackup' | 'mfaSecret' | 'yubiPIN' | 'yubikeyId'
>;

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

  async findOne(id: string, filter = true) {
    const user = await this.userModel.findById(id).exec();
    const filteredUser = user.toObject();

    if (filter) {
      delete filteredUser.password;
      delete filteredUser.secret;
      delete filteredUser.mfaBackup;
      delete filteredUser.mfaSecret;
      delete filteredUser.yubiPIN;
      delete filteredUser.yubikeyId;
      delete filteredUser.__v;

      filteredUser['id'] = filteredUser['_id'];

      delete filteredUser._id;
    }

    return filteredUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
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

    filteredUser['id'] = filteredUser['_id'];

    delete filteredUser._id;

    return filteredUser;
  }
}
