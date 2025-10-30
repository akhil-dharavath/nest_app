import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  productType: string;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsArray()
  @IsOptional()
  sizes?: string[];

  @IsString()
  @IsNotEmpty()
  strikePrice: string;

  @IsString()
  @IsNotEmpty()
  actualPrice: string;

  @IsArray()
  @IsOptional()
  reviews?: any[];

  @IsNumber()
  @IsOptional()
  stockCount?: number;

  @IsArray()
  @IsNotEmpty()
  features: any[];

  @IsArray()
  @IsOptional()
  status?: string[];
}
