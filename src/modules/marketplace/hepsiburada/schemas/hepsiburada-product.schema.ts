import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class HepsiburadaProduct extends Document {
  @ApiProperty({ description: 'Sistemdeki ürün ID' })
  @Prop({ required: true })
  productId: string;

  @ApiProperty({ description: 'Hepsiburada merchant ID' })
  @Prop({ required: true })
  merchantId: string;

  @ApiProperty({ description: 'Hepsiburada ürün ID' })
  @Prop({ required: true })
  hbProductId: string;

  @ApiProperty({ description: 'Hepsiburada liste fiyatı' })
  @Prop({ required: true })
  listPrice: number;

  @ApiProperty({ description: 'Hepsiburada satış fiyatı' })
  @Prop({ required: true })
  salePrice: number;

  @ApiProperty({ description: 'Hepsiburada stok durumu' })
  @Prop({ required: true })
  stockAmount: number;

  @ApiProperty({ description: 'Hepsiburada ürün durumu' })
  @Prop({ default: 'Active' })
  status: string;

  @ApiProperty({ description: 'Hepsiburada komisyon oranı' })
  @Prop()
  commissionRate: number;

  @ApiProperty({ description: 'Son senkronizasyon tarihi' })
  @Prop({ type: Date, default: Date.now })
  lastSyncDate: Date;
}

export const HepsiburadaProductSchema = SchemaFactory.createForClass(HepsiburadaProduct); 