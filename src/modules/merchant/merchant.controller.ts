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
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { FieldValidatorService } from '../../global-services/field-validator.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Controller('merchants')
export class MerchantController {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly fieldValidator: FieldValidatorService,
  ) {}

  private buildResponse(status: number, message: string, data?: any, error?: string) {
    return { status, message, data: data ?? null, error: error ?? null };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllMerchants() {
    try {
      const merchants = await this.merchantService.getAllMerchants();
      return this.buildResponse(HttpStatus.OK, 'Merchants fetched successfully', merchants);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to fetch merchants', null, error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMerchantById(@Param('id') id: string) {
    try {
      const merchant = await this.merchantService.getMerchantById(id);
      return this.buildResponse(HttpStatus.OK, 'Merchant fetched successfully', merchant);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to fetch merchant', null, error.message);
    }
  }

  // 🔒 Only admins & super_admins can add merchants
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('create')
  async createMerchant(@Body() dto: CreateMerchantDto, @Req() req: any) {
    try {
      this.fieldValidator.validateRequiredFields(dto, ['userId', 'name', 'images']);
      const merchant = await this.merchantService.createMerchant(dto);
      return this.buildResponse(HttpStatus.CREATED, 'Merchant created successfully', merchant);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to create merchant', null, error.message);
    }
  }

  // 🔒 Only admins & super_admins can modify merchants
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Put(':id')
  async updateMerchant(@Param('id') id: string, @Body() dto: UpdateMerchantDto) {
    try {
      const updated = await this.merchantService.updateMerchant(id, dto);
      return this.buildResponse(HttpStatus.OK, 'Merchant updated successfully', updated);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to update merchant', null, error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Delete(':id')
  async deleteMerchant(@Param('id') id: string) {
    try {
      await this.merchantService.deleteMerchant(id);
      return this.buildResponse(HttpStatus.OK, 'Merchant deleted successfully');
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to delete merchant', null, error.message);
    }
  }
}
