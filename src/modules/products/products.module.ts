import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductsSchema } from './products.schema';
import { FieldValidatorService } from '../../global-services/field-validator.service';
import { AuthService } from 'src/common/guards/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductsSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService, FieldValidatorService, AuthService],
})
export class ProductsModule {}
