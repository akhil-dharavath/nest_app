import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(data: any): Promise<Partial<UserDocument>> {
    const { username, email, password, phoneNumber, role } = data;

    if (!password) throw new BadRequestException('Password is required');
    if (!username && !email && !phoneNumber)
      throw new BadRequestException(
        'At least one of username, email, or phoneNumber is required',
      );

    const conditions: any = [];
    if (username) conditions.push({ username });
    if (email) conditions.push({ email });
    if (phoneNumber) conditions.push({ phoneNumber });

    const existingUser = await this.userModel.findOne({ $or: conditions });
    if (existingUser) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData: any = {
      password: hashedPassword,
      role: role || 'user', // default role
    };
    if (username) newUserData.username = username;
    if (email) newUserData.email = email;
    if (phoneNumber) newUserData.phoneNumber = phoneNumber;

    const newUser = new this.userModel(newUserData);
    const savedUser = await newUser.save();

    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
  }

  async login(data: any): Promise<UserDocument> {
    console.log('users/login api', JSON.stringify(data));
    const { email, phoneNumber, username, password } = data;
    // const user = await this.userModel.findOne({ email });
    let user = await this.userModel.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const userObj: any = user.toObject();
    delete userObj.password;
    delete userObj.createdAt;
    delete userObj.updatedAt;

    return userObj; // Also a Mongoose document
  }

  async getAllUsers() {
    const users = await this.userModel.find({}).select('-password');
    return users;
  }

  async getUserById(id: any) {
    const users = await this.userModel.findById(id).select('-password');
    return users;
  }
}
