// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type ProductsDocument = Product & Document;

// @Schema({ timestamps: true, versionKey: false })
// export class Product {
//   @Prop({ required: true })
//   userId: string;

//   @Prop({ required: true })
//   merchantId: string;

//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true })
//   description: string;

//   @Prop({ required: true })
//   productType: string;

//   @Prop({ type: [String], required: true })
//   images: string[];

//   @Prop({ type: [String], default: [] })
//   sizes: string[];

//   @Prop({ required: true })
//   strikePrice: string;

//   @Prop({ required: true })
//   actualPrice: string;

//   @Prop({ type: [Object], default: [] })
//   reviews: any[];

//   @Prop({ default: 0 })
//   stockCount: number;

//   @Prop({ type: [String], required: true })
//   features: any[];

//   @Prop({ type: [String], default: [] })
//   status: string[];
// }

// export const ProductsSchema = SchemaFactory.createForClass(Product);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  sku: string; // Stock Keeping Unit - unique identifier

  @Prop({ required: true })
  merchentId: string; // Renamed from merchantId for multi-merchentId setup

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  strikePrice: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({
    required: true,
    enum: ['Active', 'Draft', 'Out of Stock'],
    default: 'Draft',
  })
  status: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [String],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    default: [],
  })
  availableSizes: string[];

  @Prop({
    type: [String],
    enum: [
      'Black',
      'White',
      'Red',
      'Blue',
      'Green',
      'Yellow',
      'Orange',
      'Purple',
      'Pink',
      'Gray',
      'Brown',
      'Navy',
    ],
    default: [],
  })
  availableColors: string[];

  @Prop({ required: true })
  shippingWeight: string; // e.g., "500g" or "2kg"

  @Prop({ required: true })
  dimensions: string; // e.g., "10x15x20 cm"

  @Prop()
  seoTitle?: string;

  @Prop()
  seoDescription?: string;

  @Prop({ type: [String], required: true })
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);