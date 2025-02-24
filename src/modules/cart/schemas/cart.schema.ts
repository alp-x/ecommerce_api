import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class CartItem {
  @ApiProperty({ description: 'Ürün ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @ApiProperty({ description: 'Ürün adedi' })
  @Prop({ required: true, min: 1 })
  quantity: number;

  @ApiProperty({ description: 'Birim fiyat' })
  @Prop({ required: true, min: 0 })
  price: number;
}

@Schema({ timestamps: true })
export class Cart {
  @ApiProperty({ description: 'Kullanıcı ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @ApiProperty({ description: 'Sepet ürünleri' })
  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];

  @ApiProperty({ description: 'Toplam tutar' })
  @Prop({ default: 0 })
  totalAmount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart); 