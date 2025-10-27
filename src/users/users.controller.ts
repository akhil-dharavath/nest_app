import { Body, Controller, HttpStatus, Post, Res, Get, Param } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: any, @Res() res: Response) {
    try {
      const user = await this.usersService.register(body);

      // Remove password before sending response
      const { password, ...userData } = user.toObject();

      return res.status(HttpStatus.OK).json({
        success: true,
        statusCode: HttpStatus.OK,
        message: 'User registered successfully',
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: error.status || HttpStatus.BAD_REQUEST,
        message: error.message || 'Registration failed',
      });
    }
  }

  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    try {
      await this.usersService.login(body);

      return res.status(HttpStatus.OK).json({
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Login successful',
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: error.status || HttpStatus.UNAUTHORIZED,
        message: error.message || 'Login failed',
      });
    }
  }

  @Get('get-all-users')
  async getAllUsers(@Res() res: Response) {
    try {
      let users = await this.usersService.getAllUsers();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'User details fetched successfully',
        users,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: true,
        message: 'Trouble fetching users details',
        error,
      });
    }
  }

  @Get('get-user/:id')
  async getUserById(@Res() res: Response, @Param('id') id: string) {
    try {
      let user = await this.usersService.getUserById(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'User details fetched successfully',
        user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: true,
        message: 'Trouble fetching user details',
        error,
      });
    }
  }
}
