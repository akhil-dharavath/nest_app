import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { Merchant, MerchantSchema } from './merchant.schema';
import { FieldValidatorService } from '../../global-services/field-validator.service';
import { AuthService } from 'src/common/guards/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Merchant.name, schema: MerchantSchema }])],
  controllers: [MerchantController],
  providers: [MerchantService, FieldValidatorService, AuthService],
})
export class MerchantModule {}
