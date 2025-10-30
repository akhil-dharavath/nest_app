import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMerchantDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsArray()
  @IsOptional()
  category?: string[];

  @IsArray()
  @IsOptional()
  status?: string[];
}
