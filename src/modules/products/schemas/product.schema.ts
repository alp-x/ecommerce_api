import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @ApiProperty({ description: 'Ürün adı' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Ürün açıklaması' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Ürün fiyatı' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ description: 'Stok miktarı' })
  @Prop({ required: true, min: 0 })
  stock: number;

  @ApiProperty({ description: 'Ürün kategorisi' })
  @Prop({ required: true })
  category: string;

  @ApiProperty({ description: 'Ürün görselleri' })
  @Prop({ type: [String], default: [] })
  images: string[];

  @ApiProperty({ description: 'Ürün özellikleri' })
  @Prop({ type: Object, default: {} })
  specifications: Record<string, any>;

  @ApiProperty({ description: 'Ürün aktif mi?' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'İndirim oranı' })
  @Prop({ min: 0, max: 100, default: 0 })
  discountPercentage: number;

  @ApiProperty({ description: 'Satıcı ID' })
  @Prop({ required: true })
  sellerId: string;

  @ApiProperty({ description: 'SKU kodu' })
  @Prop({ required: true, unique: true })
  sku: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product); 