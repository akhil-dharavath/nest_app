import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Cool T-Shirt', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'SKU12345', description: 'Unique SKU code' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: '672a2cd4c8f43e00a7b55f90', description: 'Merchant ID' })
  @IsString()
  @IsNotEmpty()
  merchentId: string;

  @ApiProperty({ example: 'Clothing', description: 'Product category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 999, description: 'Product price' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({ example: 1299, description: 'Original price before discount' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  strikePrice: number;

  @ApiProperty({ example: 50, description: 'Stock count' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 'Active',
    enum: ['Active', 'Draft', 'Out of Stock'],
    description: 'Product status',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['Active', 'Draft', 'Out of Stock'])
  status: string;

  @ApiProperty({ example: 'A high-quality cotton t-shirt.', description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    required: false,
    description: 'Available sizes',
  })
  @IsArray()
  @IsOptional()
  @IsIn(['XS', 'S', 'M', 'L', 'XL', 'XXL'], { each: true })
  availableSizes?: string[];

  @ApiProperty({
    example: ['Black', 'White'],
    enum: [
      'Black',
      'White',
      'Red',
      'Blue',
      'Green',
      'Yellow',
      'Orange',
      'Purple',
      'Pink',
      'Gray',
      'Brown',
      'Navy',
    ],
    required: false,
    description: 'Available colors',
  })
  @IsArray()
  @IsOptional()
  @IsIn(
    [
      'Black',
      'White',
      'Red',
      'Blue',
      'Green',
      'Yellow',
      'Orange',
      'Purple',
      'Pink',
      'Gray',
      'Brown',
      'Navy',
    ],
    { each: true },
  )
  availableColors?: string[];

  @ApiProperty({
    example: '250g',
    description: 'Shipping weight of the product',
  })
  @IsString()
  @IsNotEmpty()
  shippingWeight: string;

  @ApiProperty({
    example: '30x20x10 cm',
    description: 'Dimensions of the product',
  })
  @IsString()
  @IsNotEmpty()
  dimensions: string;

  @ApiProperty({
    example: 'Buy the best t-shirt online!',
    required: false,
    description: 'SEO Title for better search ranking',
  })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiProperty({
    example: 'High-quality cotton t-shirt for men and women.',
    required: false,
    description: 'SEO Description for meta tags',
  })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    isArray: true,
    description: 'Product image files',
  })
  @IsArray()
  @IsOptional()
  images?: any[];
}
