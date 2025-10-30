import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { Merchant, MerchantSchema } from './merchant.schema';
import { FieldValidatorService } from '../../global-services/field-validator.service';
import { AuthModule } from 'src/common/guards/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Merchant.name, schema: MerchantSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [MerchantController],
  providers: [MerchantService, FieldValidatorService],
  exports: [MerchantService],
})
export class MerchantModule {}
