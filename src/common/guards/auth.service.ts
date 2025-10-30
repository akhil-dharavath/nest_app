import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // Generate JWT Token (used in login or register)
  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, { expiresIn: '1d' }); // 1 day validity
  }

  // Verify JWT Token validity
  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Extract user details from JWT token
  async getUserDetails(token: string): Promise<any> {
    const decoded = await this.verifyToken(token);
    const user = await this.usersService.getUserById(decoded.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
