import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductsSchema } from './products.schema';
import { FieldValidatorService } from '../../global-services/field-validator.service';
import { AuthModule } from 'src/common/guards/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductsSchema }]),
    forwardRef(() => AuthModule), // ✅ now uses exported AuthService & JwtStrategy
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FieldValidatorService],
  exports: [ProductsService],
})
export class ProductsModule {}
