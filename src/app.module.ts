import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL ?? 'mongodb://localhost:27017/nest_auth'), // or your MongoDB Atlas URL
    UsersModule,
  ],
})
export class AppModule {}
