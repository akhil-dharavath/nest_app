import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(data: any): Promise<UserDocument> {
    const { username, email, password, phoneNumber } = data;
    console.log('users/register api', JSON.stringify(data));

    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });
    console.log('existingUser', JSON.stringify(existingUser ?? {}));

    if (existingUser) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    return newUser.save(); // Returns a Mongoose Document (with .toObject)
  }

  async login(data: any): Promise<UserDocument> {
    const { email, password } = data;
    const user = await this.userModel.findOne({ email });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return user; // Also a Mongoose document
  }
}
