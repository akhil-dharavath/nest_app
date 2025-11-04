// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type MerchantDocument = Merchant & Document;

// @Schema({ timestamps: true, versionKey: false })
// export class Merchant {
//   @Prop({ required: true })
//   userId: string;

//   @Prop({ required: true })
//   name: string;

//   @Prop({ type: [String], required: true })
//   images: string[];

//   @Prop({ type: [String], default: [] })
//   category: string[];

//   @Prop({ type: [String], default: [] })
//   status: string[];
// }

// export const MerchantSchema = SchemaFactory.createForClass(Merchant);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MerchantDocument = Merchant & Document;

@Schema({ timestamps: true, versionKey: false })
export class Merchant {
  // Linked User
  @Prop({ required: true })
  userId: string;

  // Merchandise / Production Info
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  subdomain: string;

  @Prop({ required: true })
  productionHouse: string;

  // Category & Genres
  @Prop({ type: [String], required: true })
  category: string[];

  @Prop({
    type: [String],
    enum: [
      'Action',
      'Adventure',
      'Animation',
      'Comedy',
      'Crime',
      'Documentary',
      'Drama',
      'Family',
      'Fantasy',
      'Horror',
      'Mystery',
      'Romance',
      'Sci-Fi',
      'Thriller',
      'War',
      'Western',
    ],
    default: [],
  })
  genres: string[];

  // Media & Description
  @Prop({ type: Date })
  releaseDate: Date;

  @Prop({ type: Number, min: 0, max: 10 })
  rating: number;

  @Prop({ required: true })
  description: string;

  // Images (Logo, Banner, Gallery)
  @Prop({ type: String })
  logo: string;

  @Prop({ type: String })
  bannerImage: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  // Contact Info
  @Prop({ required: true })
  contactEmail: string;

  @Prop({ required: true })
  contactPhone: string;

  @Prop()
  websiteUrl?: string;

  @Prop()
  facebookUrl?: string;

  @Prop()
  instagramUrl?: string;

  @Prop()
  twitterUrl?: string;

  // Status
  @Prop({
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  })
  status: string;
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
