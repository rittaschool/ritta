import * as argon2 from 'argon2';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Cryptor } from '../utils/encryption';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RandomString } from '../utils/randomString';

// Omit removes some properties from User interface
export interface FilteredUser
  extends Omit<
    User,
    'password' | 'secret' | 'mfaBackup' | 'mfaSecret' | 'yubiPIN' | 'yubikeyId'
  > {
  id: string;
}

@Injectable()
export class UsersService {
  // Inject our depedencies
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cryptor: Cryptor,
    private randomString: RandomString,
  ) {}

  async create({
    password,
    firstName,
    lastName,
  }: CreateUserDto): Promise<User> {
    // try-catch makes sure that it doesnt throw error for not finding user
    let possibleUser: User;
    try {
      possibleUser = await this.findOne(`${firstName}.${lastName}`.toLowerCase())
    } catch (error) {}
    
    if (possibleUser) throw new BadRequestException('User already exists!')

    // Hash and encryp tthe password
    const hashed = this.cryptor.encrypt(
      await argon2.hash(password || '', { hashLength: 20 }),
    );

    // Save user in database
    const record = await this.userModel.create({
      password: hashed,
      secret: this.randomString.generate(),
      username: firstName.toLowerCase() + '.' + lastName.toLowerCase(),
      firstName,
      lastName,
    });

    // Return the object of the user
    return record.toObject();
  }

  async findAll(): Promise<User[]> {
    const userDocs = await this.userModel.find().exec();

    return userDocs.map((user) => user.toObject());
  }

  async findOne(
    identifier: string,
  ): Promise<User> {
    try {
      const user = await this.userModel.findOne({
        $or: [
          {
            username: identifier,
          },
          {
            id: identifier,
          }
        ],
      })

      return user.toObject()
    } catch (error) {
      throw new Error('User not found!')
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate({id}, updateUserDto)
    
    return updatedUser
  }

  async remove(id: string): Promise<User> {
    const removedUser = await this.userModel.remove({ id })

    return removedUser
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

    return filteredUser as unknown as Promise<FilteredUser>
  }
}
