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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FieldValidatorService } from '../../global-services/field-validator.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly fieldValidator: FieldValidatorService,
  ) {}

  private buildResponse(status: number, message: string, data?: any, error?: string) {
    return { status, message, data: data ?? null, error: error ?? null };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProducts() {
    try {
      const products = await this.productsService.getAllProducts();
      return this.buildResponse(HttpStatus.OK, 'Products fetched successfully', products);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to fetch products', null, error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      const product = await this.productsService.getProductById(id);
      return this.buildResponse(HttpStatus.OK, 'Product fetched successfully', product);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to fetch product', null, error.message);
    }
  }

  // 🔒 Only admin & super_admin can create products
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('create')
  async createProduct(@Body() dto: CreateProductDto) {
    try {
      this.fieldValidator.validateRequiredFields(dto, [
        'userId',
        'merchantId',
        'name',
        'description',
        'productType',
        'images',
        'strikePrice',
        'actualPrice',
        'features',
      ]);

      const product = await this.productsService.createProduct(dto);
      return this.buildResponse(HttpStatus.CREATED, 'Product created successfully', product);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to create product', null, error.message);
    }
  }

  // 🔒 Only admin & super_admin can update products
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    try {
      const updated = await this.productsService.updateProduct(id, dto);
      return this.buildResponse(HttpStatus.OK, 'Product updated successfully', updated);
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to update product', null, error.message);
    }
  }

  // 🔒 Only admin & super_admin can delete products
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      await this.productsService.deleteProduct(id);
      return this.buildResponse(HttpStatus.OK, 'Product deleted successfully');
    } catch (error) {
      return this.buildResponse(HttpStatus.BAD_REQUEST, 'Failed to delete product', null, error.message);
    }
  }
}
