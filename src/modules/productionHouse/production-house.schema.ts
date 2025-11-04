import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductionHouseDocument = ProductionHouse & Document;

@Schema({ timestamps: true, versionKey: false })
export class ProductionHouse {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  subdomain: string;

  @Prop()
  contactEmail?: string;

  @Prop()
  contactPhone?: string;

  @Prop()
  description?: string;

  @Prop()
  logo?: string; // stored as URL
}

export const ProductionHouseSchema = SchemaFactory.createForClass(ProductionHouse);
