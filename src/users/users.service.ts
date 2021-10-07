import * as argon2 from 'argon2';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cryptor } from '../utils/encryption.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RandomString } from '../utils/randomString';
import { Provider } from '../auth/types';
import { UsersRepository } from './users.repository';

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
    private readonly usersRepository: UsersRepository,
    private cryptor: Cryptor,
    private randomString: RandomString,
  ) {}

  async create({
    password,
    firstName,
    lastName,
    username,
  }: CreateUserDto): Promise<User> {
    // try-catch makes sure that it doesnt throw error for not finding user
    let possibleUser: User;
    try {
      possibleUser = await this.findOne(username.toLowerCase());
    } catch (error) {}

    if (possibleUser) throw new BadRequestException('User already exists!');

    // Hash and encryp tthe password
    const hashed = this.cryptor.encrypt(
      await argon2.hash(password || '', { hashLength: 20 }),
    );

    // Save user in database
    const record = await this.usersRepository.create({
      password: hashed,
      secret: this.randomString.generate(),
      username,
      firstName,
      oauth2Identifiers: {
        opinsys: '1',
      },
      lastName,
    });

    // Return the object of the user
    return record.toObject();
  }

  async findOneWithSocial(provider: Provider, id: string) {
    const property = {};
    property[provider] = id;

    const user = await this.usersRepository.findOne({
      oauth2Identifiers: property,
    });

    console.log(user, property);

    return user.toObject();
  }

  async findAll(): Promise<User[]> {
    const userDocs = await this.usersRepository.find({});

    return userDocs.map((user) => user.toObject());
  }

  async findOne(identifier: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        $or: [
          {
            username: identifier,
          },
          {
            id: identifier,
          },
        ],
      });

      return user.toObject();
    } catch (error) {
      throw new Error('User not found!');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.usersRepository.findOneAndUpdate(
      { id },
      { ...updateUserDto, updatedAt: new Date() },
    );

    if (!updatedUser) throw new NotFoundException('User not found!');

    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const removedUser = await this.usersRepository.findByIdAndDelete(id);

    return removedUser;
  }

  async filterUser(user: User): Promise<FilteredUser> {
    const filteredUser = user;

    delete filteredUser.password;
    delete filteredUser.secret;
    delete filteredUser.mfa;
    delete filteredUser.yubikey;
    delete (filteredUser as any).__v;

    if (filteredUser['_id']) {
      delete filteredUser.id;
      filteredUser['id'] = filteredUser['_id'];
      delete (filteredUser as any)._id;
    }

    return filteredUser as unknown as Promise<FilteredUser>;
  }
}
