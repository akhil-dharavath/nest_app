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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductionHouseService } from './production-house.service';
import { FieldValidatorService } from '../../global-services/field-validator.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateProductionHouseDto } from './dto/create-production-house.dto';
import { UpdateProductionHouseDto } from './dto/update-production-house.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('production-houses')
export class ProductionHouseController {
  constructor(
    private readonly productionHouseService: ProductionHouseService,
    private readonly fieldValidator: FieldValidatorService,
  ) {}

  private buildResponse(status: number, message: string, data?: any, error?: string) {
    return { status, message, data: data ?? null, error: error ?? null };
  }

  // Get all
  @Get()
  async getAll() {
    try {
      const data = await this.productionHouseService.getAllProductionHouses();
      return this.buildResponse(HttpStatus.OK, 'Production houses fetched successfully', data);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to fetch production houses', null, error.message);
    }
  }

  // Get by ID
  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const data = await this.productionHouseService.getProductionHouseById(id);
      return this.buildResponse(HttpStatus.OK, 'Production house fetched successfully', data);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to fetch production house', null, error.message);
    }
  }

  // Create (with file upload)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('create')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Production House create payload',
    type: CreateProductionHouseDto,
  })
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @UploadedFile() logo: Express.Multer.File,
    @Body() dto: CreateProductionHouseDto,
  ) {
    try {
      this.fieldValidator.validateRequiredFields(dto, ['userId', 'name', 'subdomain', 'contactEmail']);

      if (logo) {
        dto.logo = logo.filename; // or upload URL
      }

      const data = await this.productionHouseService.createProductionHouse(dto);
      return this.buildResponse(HttpStatus.OK, 'Production house created successfully', data);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to create production house', null, error.message);
    }
  }

  // Update (with optional logo upload)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @UploadedFile() logo: Express.Multer.File,
    @Body() dto: UpdateProductionHouseDto,
  ) {
    try {
      if (logo) dto.logo = logo.filename;
      const data = await this.productionHouseService.updateProductionHouse(id, dto);
      return this.buildResponse(HttpStatus.OK, 'Production house updated successfully', data);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to update production house', null, error.message);
    }
  }

  // Delete
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.productionHouseService.deleteProductionHouse(id);
      return this.buildResponse(HttpStatus.OK, 'Production house deleted successfully');
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to delete production house', null, error.message);
    }
  }
}
