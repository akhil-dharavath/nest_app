import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductionHouseController } from './production-house.controller';
import { ProductionHouseService } from './production-house.service';
import { ProductionHouse, ProductionHouseSchema } from './production-house.schema';
import { FieldValidatorService } from '../../global-services/field-validator.service';
import { AuthModule } from 'src/common/guards/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductionHouse.name, schema: ProductionHouseSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProductionHouseController],
  providers: [ProductionHouseService, FieldValidatorService],
  exports: [ProductionHouseService],
})
export class ProductionHouseModule {}
