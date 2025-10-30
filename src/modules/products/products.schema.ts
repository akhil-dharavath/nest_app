import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductsDocument = Product & Document;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  merchantId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  productType: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: [String], default: [] })
  sizes: string[];

  @Prop({ required: true })
  strikePrice: string;

  @Prop({ required: true })
  actualPrice: string;

  @Prop({ type: [Object], default: [] })
  reviews: any[];

  @Prop({ default: 0 })
  stockCount: number;

  @Prop({ type: [String], required: true })
  features: any[];

  @Prop({ type: [String], default: [] })
  status: string[];
}

export const ProductsSchema = SchemaFactory.createForClass(Product);
