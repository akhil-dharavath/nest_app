import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { MerchantModule } from './modules/merchant/merchant.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL ?? 'mongodb://localhost:27017/nest_auth'), // or your MongoDB Atlas URL
    UsersModule,
    ProductsModule,
    MerchantModule
  ],
})
export class AppModule {}