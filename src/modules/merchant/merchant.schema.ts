import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MerchantDocument = Merchant & Document;

@Schema({ timestamps: true, versionKey: false })
export class Merchant {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: [String], default: [] })
  category: string[];

  @Prop({ type: [String], default: [] })
  status: string[];
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
