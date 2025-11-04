import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMerchantDto {
  @ApiProperty({ example: '64fbc1234abc456789d12345', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'DreamWorks Studio', description: 'Merchant name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'dreamworks',
    description: 'Unique subdomain for the merchant',
  })
  @IsString()
  @IsNotEmpty()
  subdomain: string;

  @ApiProperty({
    example: 'DreamWorks Production House',
    description: 'Production house name',
  })
  @IsString()
  @IsNotEmpty()
  productionHouse: string;

  @ApiProperty({
    example: ['Movies', 'Series'],
    description: 'Category list',
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  category: string[];

  @ApiPropertyOptional({
    example: ['Action', 'Adventure'],
    description: 'Optional list of genres',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  genres?: string[];

  @ApiPropertyOptional({
    example: '2025-10-15',
    description: 'Release date (optional)',
    type: String,
  })
  @IsOptional()
  releaseDate?: Date;

  @ApiPropertyOptional({ example: 4.7, description: 'Merchant rating (0–5)' })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({
    example: 'A world-renowned studio producing award-winning movies.',
    description: 'Description of the merchant',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Logo image file',
  })
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Banner image file',
  })
  @IsOptional()
  bannerImage?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    isArray: true,
    description: 'Additional image files',
  })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: 'info@dreamworks.com',
    description: 'Contact email address',
  })
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @ApiProperty({ example: '+1-202-555-0178', description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @ApiPropertyOptional({
    example: 'https://dreamworks.com',
    description: 'Official website URL',
  })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional({
    example: 'https://facebook.com/dreamworks',
    description: 'Facebook page link',
  })
  @IsString()
  @IsOptional()
  facebookUrl?: string;

  @ApiPropertyOptional({
    example: 'https://instagram.com/dreamworks',
    description: 'Instagram handle link',
  })
  @IsString()
  @IsOptional()
  instagramUrl?: string;

  @ApiPropertyOptional({
    example: 'https://twitter.com/dreamworks',
    description: 'Twitter profile link',
  })
  @IsString()
  @IsOptional()
  twitterUrl?: string;

  @ApiPropertyOptional({
    example: 'Active',
    description: 'Merchant status',
  })
  @IsString()
  @IsOptional()
  status?: string;
}
