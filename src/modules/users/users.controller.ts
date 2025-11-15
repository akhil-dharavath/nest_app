import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { AuthService } from 'src/common/guards/auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // REGISTER
  @Post('register')
  @UseGuards(OptionalJwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(
    @Body() body: RegisterUserDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      // If trying to create admin/super_admin, require super_admin token
      if (body.role === 'admin' || body.role === 'super_admin') {
        console.log('req.user', JSON.stringify(req.user));
        if (!req.user || req.user.role !== 'super_admin') {
          return res.status(HttpStatus.FORBIDDEN).json({
            status: HttpStatus.FORBIDDEN,
            statusCode: 'UC_RG_003',
            message:
              'Only a super_admin can register an admin or super_admin account',
            data: null,
            error: 'Forbidden',
          });
        }
      }

      const user = await this.usersService.register(body);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        statusCode: 'UC_RG_001',
        message: 'User registered successfully',
        data: user,
        error: null,
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.BAD_REQUEST).json({
        status: error.status || HttpStatus.BAD_REQUEST,
        statusCode: 'UC_RG_002',
        message: error.message || 'Registration failed',
        data: null,
        error,
      });
    }
  }

  // LOGIN
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    try {
      const user = await this.usersService.login(body);
      const token = await this.authService.generateToken({
        user: {
          id: user._id,
          role: user.role,
        },
      });

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        statusCode: 'UC_LG_001',
        message: 'Login successful',
        data: { user, token },
        error: null,
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.UNAUTHORIZED).json({
        status: error.status || HttpStatus.UNAUTHORIZED,
        statusCode: 'UC_LG_002',
        message: error.message || 'Login failed',
        data: null,
        error,
      });
    }
  }

  // GET ALL USERS (Protected)
  @Get('get-all-users')
  async getAllUsers(
    @Headers('authorization') authHeader: string,
    @Res() res: Response,
  ) {
    try {
      if (!authHeader?.startsWith('Bearer '))
        throw new Error('Missing Bearer token');
      const token = authHeader.split(' ')[1];
      await this.authService.verifyToken(token);

      const users = await this.usersService.getAllUsers();
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        statusCode: 'UC_GAU_001',
        message: 'Users fetched successfully',
        data: users,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        statusCode: 'UC_GAU_002',
        message: error.message || 'Unauthorized access',
        data: null,
        error,
      });
    }
  }

  // GET USER BY ID (Protected)
  @Get('get-user/:id')
  async getUserById(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
    @Res() res: Response,
  ) {
    try {
      if (!authHeader?.startsWith('Bearer '))
        throw new Error('Missing Bearer token');
      const token = authHeader.split(' ')[1];
      await this.authService.verifyToken(token);

      const user = await this.usersService.getUserById(id);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        statusCode: 'UC_GUI_001',
        message: 'User fetched successfully',
        data: user,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        statusCode: 'UC_GUI_002',
        message: error.message || 'Unauthorized access',
        data: null,
        error,
      });
    }
  }

  @Post('filter')
  async filterUsers(
    @Body()
    body: {
      role?: string;
      search?: string;
      tenant?: string;
      page?: number;
      limit?: number;
    },
    @Headers('authorization') authHeader: string,
    @Res() res: Response,
  ) {
    try {
      if (!authHeader?.startsWith('Bearer '))
        throw new Error('Missing Bearer token');

      const token = authHeader.split(' ')[1];
      await this.authService.verifyToken(token);

      const { role, search, tenant, page = 1, limit = 10 } = body;

      const data = await this.usersService.filterUsers({
        role,
        search,
        tenant,
        page,
        limit,
      });

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        statusCode: 'UC_FLT_001',
        message: 'Users filtered successfully',
        data,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        statusCode: 'UC_FLT_002',
        message: error.message || 'Filtering failed',
        data: null,
        error,
      });
    }
  }
}
