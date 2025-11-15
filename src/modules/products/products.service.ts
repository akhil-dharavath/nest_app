import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadService } from 'src/global-services/upload/upload.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private uploadService: UploadService,
  ) {}

  // async createProduct(data: CreateProductDto): Promise<Product> {
  //   const newProduct = new this.productModel(data);
  //   return newProduct.save();
  // }

  async createProduct(
    data: CreateProductDto,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    try {
      let imageUrls: string[] = [];

      // Upload images if provided
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) =>
          this.uploadService.uploadImage(file),
        );
        imageUrls = await Promise.all(uploadPromises);
      }

      const newProduct = new this.productModel({
        ...data,
        images: imageUrls,
      });

      return await newProduct.save();
    } catch (error) {
      throw new BadRequestException('Error creating product: ' + error.message);
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
  //   const updated = await this.productModel.findByIdAndUpdate(id, data, { new: true }).exec();
  //   if (!updated) throw new NotFoundException('Product not found');
  //   return updated;
  // }

  async updateProduct(
    id: string,
    data: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');

    try {
      let newImageUrls: string[] = [];

      // Upload new images if any
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) =>
          this.uploadService.uploadImage(file),
        );
        newImageUrls = await Promise.all(uploadPromises);
      }

      // Keep existing + new images
      const updatedImages = [...(product.images || []), ...newImageUrls];

      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        { ...data, images: updatedImages },
        { new: true },
      );

      return updatedProduct as unknown as Product;
    } catch (error) {
      throw new BadRequestException('Error updating product: ' + error.message);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Product not found');
  }

  async filterProducts({
    merchentId,
    category,
    status,
    search,
    page,
    limit,
  }: {
    merchentId?: string;
    category?: string;
    status?: string;
    search?: string;
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;

    const query: any = {};

    // Filter by merchentId
    if (merchentId) {
      query.merchentId = merchentId;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by product status
    if (status) {
      query.status = status;
    }

    // Search: name, SKU, category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.productModel.find(query).skip(skip).limit(limit),
      this.productModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
