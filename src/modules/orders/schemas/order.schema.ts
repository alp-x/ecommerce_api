import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class OrderItem {
  @ApiProperty({ description: 'Ürün ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @ApiProperty({ description: 'Ürün adı' })
  @Prop({ required: true })
  productName: string;

  @ApiProperty({ description: 'Ürün adedi' })
  @Prop({ required: true, min: 1 })
  quantity: number;

  @ApiProperty({ description: 'Birim fiyat' })
  @Prop({ required: true, min: 0 })
  price: number;
}

@Schema({ timestamps: true })
export class Order {
  @ApiProperty({ description: 'Kullanıcı ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @ApiProperty({ description: 'Sipariş ürünleri' })
  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @ApiProperty({ description: 'Toplam tutar' })
  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @ApiProperty({ description: 'Sipariş durumu' })
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ description: 'Teslimat adresi' })
  @Prop({ required: true })
  shippingAddress: string;

  @ApiProperty({ description: 'Ödeme ID' })
  @Prop({ type: String })
  paymentId: string;

  @ApiProperty({ description: 'Kargo takip numarası' })
  @Prop({ type: String })
  trackingNumber?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order); 