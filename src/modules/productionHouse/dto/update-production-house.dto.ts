import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionHouseDto } from './create-production-house.dto';

export class UpdateProductionHouseDto extends PartialType(CreateProductionHouseDto) {}
