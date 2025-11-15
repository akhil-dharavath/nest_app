import { UploadService } from 'src/global-services/upload/upload.service';
// import {
//   Controller,
//   Post,
//   Get,
//   Put,
//   Delete,
//   Body,
//   Param,
//   HttpStatus,
//   UseGuards,
//   Req,
// } from '@nestjs/common';
// import { MerchantService } from './merchant.service';
// import { FieldValidatorService } from '../../global-services/field-validator.service';
// import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { CreateMerchantDto } from './dto/create-merchant.dto';
// import { UpdateMerchantDto } from './dto/update-merchant.dto';

// @Controller('merchants')
// export class MerchantController {
//   constructor(
//     private readonly merchantService: MerchantService,
//     private readonly fieldValidator: FieldValidatorService,
//   ) {}

//   private buildResponse(status: number, message: string, data?: any, error?: string) {
//     return { status, message, data: data ?? null, error: error ?? null };
//   }

//   @Get()
//   async getAllMerchants() {
//     try {
//       const merchants = await this.merchantService.getAllMerchants();
//       return this.buildResponse(HttpStatus.OK, 'Merchants fetched successfully', merchants);
//     } catch (error) {
//       return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to fetch merchants', null, error.message);
//     }
//   }

//   @Get(':id')
//   async getMerchantById(@Param('id') id: string) {
//     try {
//       const merchant = await this.merchantService.getMerchantById(id);
//       return this.buildResponse(HttpStatus.OK, 'Merchant fetched successfully', merchant);
//     } catch (error) {
//       return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to fetch merchant', null, error.message);
//     }
//   }

//   // Only admins & super_admins can add merchants
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin', 'super_admin')
//   @Post('create')
//   async createMerchant(@Body() dto: CreateMerchantDto, @Req() req: any) {
//     try {
//       this.fieldValidator.validateRequiredFields(dto, ['userId', 'name', 'images']);
//       const merchant = await this.merchantService.createMerchant(dto);
//       return this.buildResponse(HttpStatus.OK, 'Merchant created successfully', merchant);
//     } catch (error) {
//       return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to create merchant', null, error.message);
//     }
//   }

//   // Only admins & super_admins can modify merchants
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin', 'super_admin')
//   @Put(':id')
//   async updateMerchant(@Param('id') id: string, @Body() dto: UpdateMerchantDto) {
//     try {
//       const updated = await this.merchantService.updateMerchant(id, dto);
//       return this.buildResponse(HttpStatus.OK, 'Merchant updated successfully', updated);
//     } catch (error) {
//       return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to update merchant', null, error.message);
//     }
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin', 'super_admin')
//   @Delete(':id')
//   async deleteMerchant(@Param('id') id: string) {
//     try {
//       await this.merchantService.deleteMerchant(id);
//       return this.buildResponse(HttpStatus.OK, 'Merchant deleted successfully');
//     } catch (error) {
//       return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to delete merchant', null, error.message);
//     }
//   }
// }

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { FieldValidatorService } from '../../global-services/field-validator.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('merchants')
export class MerchantController {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly fieldValidator: FieldValidatorService,
  ) {}

  private buildResponse(
    status: number,
    message: string,
    data?: any,
    error?: string,
  ) {
    return { status, message, data: data ?? null, error: error ?? null };
  }

  @Get('categories')
  async getCategories() {
    try {
      let categories = [
        'Action',
        'Adventure',
        'Animation',
        'Comedy',
        'Crime',
        'Documentary',
        'Drama',
        'Family',
        'Fantasy',
        'Horror',
        'Mystery',
        'Romance',
        'Sci-Fi',
        'Thriller',
        'War',
        'Western',
      ];
      return this.buildResponse(
        HttpStatus.OK,
        'Categories list fetched successfully',
        categories,
      );
    } catch (error) {
      return this.buildResponse(
        HttpStatus.BAD_REQUEST,
        'Failed to fetch categories',
        null,
        error.message,
      );
    }
  }

  @Get()
  async getAllMerchants() {
    try {
      const merchants = await this.merchantService.getAllMerchants();
      return this.buildResponse(
        HttpStatus.OK,
        'Merchants fetched successfully',
        merchants,
      );
    } catch (error) {
      return this.buildResponse(
        HttpStatus.BAD_REQUEST,
        'Failed to fetch merchants',
        null,
        error.message,
      );
    }
  }

  @Get(':id')
  async getMerchantById(@Param('id') id: string) {
    try {
      const merchant = await this.merchantService.getMerchantById(id);
      return this.buildResponse(
        HttpStatus.OK,
        'Merchant fetched successfully',
        merchant,
      );
    } catch (error) {
      return this.buildResponse(
        HttpStatus.BAD_REQUEST,
        'Failed to fetch merchant',
        null,
        error.message,
      );
    }
  }

  // Create merchant with file uploads
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('create')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Merchant create payload',
    type: CreateMerchantDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async createMerchant(
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Body() dto: CreateMerchantDto,
  ) {
    try {
      this.fieldValidator.validateRequiredFields(dto, ['userId', 'name']);

      const merchant = await this.merchantService.createMerchant(dto, files);

      return this.buildResponse(
        HttpStatus.OK,
        'Merchant created successfully',
        merchant,
      );
    } catch (error) {
      return this.buildResponse(
        HttpStatus.BAD_REQUEST,
        'Failed to create merchant',
        null,
        error.message,
      );
    }
  }

  // Update merchant with optional file uploads
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async updateMerchant(
    @Param('id') id: string,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Body() dto: UpdateMerchantDto,
  ) {
    try {
      const updated = await this.merchantService.updateMerchant(id, dto, files);
      return this.buildResponse(
        HttpStatus.OK,
        'Merchant updated successfully',
        updated,
      );
    } catch (error) {
      return this.buildResponse(
        HttpStatus.BAD_REQUEST,
        'Failed to update merchant',
        null,
        error.message,
      );
    }
  }

  // Only admin & super_admin can delete merchants
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Delete(':id')
  async deleteMerchant(@Param('id') id: string) {
    try {
      await this.merchantService.deleteMerchant(id);
      return this.buildResponse(HttpStatus.OK, 'Merchant deleted successfully');
    } catch (error) {
      return this.buildResponse(
        HttpStatus.BAD_REQUEST,
        'Failed to delete merchant',
        null,
        error.message,
      );
    }
  }

  @Post('filter')
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        search: { type: 'string' },
        category: { type: 'string' },
        genres: { type: 'string' },
        status: { type: 'string', enum: ['Active', 'Inactive'] },
        minRating: { type: 'number' },
        maxRating: { type: 'number' },
        startDate: { type: 'string', format: 'date' },
        endDate: { type: 'string', format: 'date' },
        page: { type: 'number', default: 1 },
        limit: { type: 'number', default: 10 },
      },
    },
  })
  async filterMerchants(
    @Body()
    body: {
      search?: string;
      category?: string;
      genres?: string;
      status?: string;
      minRating?: number;
      maxRating?: number;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    },
  ) {
    try {
      const { page = 1, limit = 10 } = body;

      const result = await this.merchantService.filterMerchants({
        ...body,
        page,
        limit,
      });

      return this.buildResponse(
        HttpStatus.OK,
        'Filtered merchants fetched successfully',
        result,
      );
    } catch (error) {
      return this.buildResponse(
        HttpStatus.BAD_REQUEST,
        'Failed to filter merchants',
        null,
        error.message,
      );
    }
  }
}
