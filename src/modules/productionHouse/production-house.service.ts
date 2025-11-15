import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductionHouse,
  ProductionHouseDocument,
} from './production-house.schema';
import { CreateProductionHouseDto } from './dto/create-production-house.dto';
import { UpdateProductionHouseDto } from './dto/update-production-house.dto';

@Injectable()
export class ProductionHouseService {
  constructor(
    @InjectModel(ProductionHouse.name)
    private readonly productionHouseModel: Model<ProductionHouseDocument>,
  ) {}

  async createProductionHouse(
    data: CreateProductionHouseDto,
  ): Promise<ProductionHouse> {
    const newPH = new this.productionHouseModel(data);
    return newPH.save();
  }

  async getAllProductionHouses(): Promise<ProductionHouse[]> {
    return this.productionHouseModel.find().exec();
  }

  async getProductionHouseById(id: string): Promise<ProductionHouse> {
    const ph = await this.productionHouseModel.findById(id).exec();
    if (!ph) throw new NotFoundException('Production house not found');
    return ph;
  }

  async updateProductionHouse(
    id: string,
    data: UpdateProductionHouseDto,
  ): Promise<ProductionHouse> {
    const updated = await this.productionHouseModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Production house not found');
    return updated;
  }

  async deleteProductionHouse(id: string): Promise<void> {
    const deleted = await this.productionHouseModel
      .findByIdAndDelete(id)
      .exec();
    if (!deleted) throw new NotFoundException('Production house not found');
  }

  async filterProductionHouses({
    page,
    limit,
    search,
    userId,
  }: {
    page: number;
    limit: number;
    search?: string;
    userId?: string;
  }) {
    const skip = (page - 1) * limit;

    const query: any = {};

    // Optional user filter
    if (userId) {
      query.userId = userId;
    }

    // Search by name, subdomain, email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subdomain: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.productionHouseModel.find(query).skip(skip).limit(limit),
      this.productionHouseModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
