import { UploadService } from 'src/global-services/upload/upload.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    private uploadService: UploadService
  ) {}

  // async createMerchant(data: CreateMerchantDto): Promise<Merchant> {
  //   const newMerchant = new this.merchantModel(data);
  //   return newMerchant.save();
  // }

  async createMerchant(
    data: CreateMerchantDto,
    files?: { logo?: Express.Multer.File[]; images?: Express.Multer.File[] },
  ): Promise<Merchant> {
    try {
      let logoUrl = '';
      let imageUrls: string[] = [];

      // Upload logo
      if (files?.logo?.length) {
        const uploadedLogo = await this.uploadService.uploadImage(files.logo[0]);
        logoUrl = uploadedLogo;
      }

      // Upload images
      if (files?.images?.length) {
        const uploadPromises = files.images.map((file) =>
          this.uploadService.uploadImage(file),
        );
        imageUrls = await Promise.all(uploadPromises);
      }

      const newMerchant = new this.merchantModel({
        ...data,
        logo: logoUrl,
        images: imageUrls,
      });

      return await newMerchant.save();
    } catch (error) {
      throw new BadRequestException('Error creating merchant: ' + error.message);
    }
  }

  async getAllMerchants(): Promise<Merchant[]> {
    return this.merchantModel.find().exec();
  }

  async getMerchantById(id: string): Promise<Merchant> {
    const merchant = await this.merchantModel.findById(id).exec();
    if (!merchant) throw new NotFoundException('Merchant not found');
    return merchant;
  }

  // async updateMerchant(id: string, data: UpdateMerchantDto): Promise<Merchant> {
  //   const updated = await this.merchantModel.findByIdAndUpdate(id, data, { new: true }).exec();
  //   if (!updated) throw new NotFoundException('Merchant not found');
  //   return updated;
  // }

  async updateMerchant(
    id: string,
    data: UpdateMerchantDto,
    files?: { logo?: Express.Multer.File[]; images?: Express.Multer.File[] },
  ): Promise<Merchant> {
    try {
      const merchant = await this.merchantModel.findById(id);
      if (!merchant) throw new NotFoundException('Merchant not found');

      let logoUrl = merchant.logo || '';
      let imageUrls = merchant.images || [];

      // Replace logo if new uploaded
      if (files?.logo?.length) {
        const uploadedLogo = await this.uploadService.uploadImage(files.logo[0]);
        logoUrl = uploadedLogo;
      }

      // Append new images
      if (files?.images?.length) {
        const newImageUrls = await Promise.all(
          files.images.map((file) => this.uploadService.uploadImage(file)),
        );
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      merchant.set({
        ...data,
        logo: logoUrl,
        images: imageUrls,
      });

      return await merchant.save();
    } catch (error) {
      throw new BadRequestException('Error updating merchant: ' + error.message);
    }
  }

  async deleteMerchant(id: string): Promise<void> {
    const deleted = await this.merchantModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Merchant not found');
  }
}
