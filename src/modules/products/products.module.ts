import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './products.schema';
import { FieldValidatorService } from '../../global-services/field-validator.service';
import { AuthModule } from 'src/common/guards/auth.module';
import { UploadModule } from 'src/global-services/upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => AuthModule), // now uses exported AuthService & JwtStrategy
    UploadModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FieldValidatorService],
  exports: [ProductsService],
})
export class ProductsModule {}
