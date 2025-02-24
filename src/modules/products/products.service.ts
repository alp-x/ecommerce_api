import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productModel.create(createProductDto);
  }

  async findAll(filterProductDto: FilterProductDto): Promise<Product[]> {
    const { category, minPrice, maxPrice, search } = filterProductDto;
    const query: any = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    return this.productModel.find(query).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Ürün #${id} bulunamadı`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, { $set: updateProductDto }, { new: true })
      .exec();

    if (!product) {
      throw new NotFoundException(`Ürün #${id} bulunamadı`);
    }

    return product;
  }

  async remove(id: string): Promise<Product> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Ürün #${id} bulunamadı`);
    }
    return result;
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const result = await this.productModel
      .updateOne(
        { _id: id },
        { $inc: { stock: -quantity } },
        { new: true },
      )
      .exec();

    if (result.modifiedCount === 0) {
      throw new NotFoundException(`Ürün #${id} bulunamadı`);
    }
  }

  async getBySellerId(sellerId: string): Promise<Product[]> {
    return this.productModel.find({ sellerId }).exec();
  }
} 