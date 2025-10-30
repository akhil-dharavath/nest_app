import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Merchant, MerchantDocument } from './merchant.schema';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(Merchant.name)
    private readonly merchantModel: Model<MerchantDocument>,
  ) {}

  async createMerchant(data: CreateMerchantDto): Promise<Merchant> {
    const newMerchant = new this.merchantModel(data);
    return newMerchant.save();
  }

  async getAllMerchants(): Promise<Merchant[]> {
    return this.merchantModel.find().exec();
  }

  async getMerchantById(id: string): Promise<Merchant> {
    const merchant = await this.merchantModel.findById(id).exec();
    if (!merchant) throw new NotFoundException('Merchant not found');
    return merchant;
  }

  async updateMerchant(id: string, data: UpdateMerchantDto): Promise<Merchant> {
    const updated = await this.merchantModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Merchant not found');
    return updated;
  }

  async deleteMerchant(id: string): Promise<void> {
    const deleted = await this.merchantModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Merchant not found');
  }
}
