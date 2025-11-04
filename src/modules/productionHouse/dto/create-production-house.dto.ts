import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateProductionHouseDto {
  @ApiProperty({
    description: 'ID of the user who creates the production house',
    example: '66f89a21d2c457ab98f0b5b2',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Name of the production house',
    example: 'DreamWorks Studios',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique subdomain for the production house',
    example: 'dreamworks',
  })
  @IsString()
  @IsNotEmpty()
  subdomain: string;

  @ApiPropertyOptional({
    description: 'Contact email of the production house',
    example: 'info@dreamworks.com',
  })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number of the production house',
    example: '+1-202-555-0156',
  })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Brief description about the production house',
    example: 'A leading film production company known for high-quality movies.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Logo image URL or filename after upload',
    example: 'https://cdn.example.com/logos/dreamworks.png',
  })
  @IsString()
  @IsOptional()
  logo?: string;
}
