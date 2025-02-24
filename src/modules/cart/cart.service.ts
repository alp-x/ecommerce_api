import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) {
      cart = await this.cartModel.create({ userId, items: [], totalAmount: 0 });
    }
    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const product = await this.productsService.findOne(addToCartDto.productId);
    if (product.stock < addToCartDto.quantity) {
      throw new Error('Yetersiz stok');
    }

    const cart = await this.getCart(userId);
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === addToCartDto.productId,
    );

    if (existingItemIndex > -1) {
      // Mevcut ürünün miktarını güncelle
      return this.cartModel
        .findOneAndUpdate(
          { userId, 'items.productId': addToCartDto.productId },
          {
            $inc: {
              'items.$.quantity': addToCartDto.quantity,
              totalAmount: product.price * addToCartDto.quantity,
            },
          },
          { new: true },
        )
        .exec();
    } else {
      // Yeni ürün ekle
      return this.cartModel
        .findOneAndUpdate(
          { userId },
          {
            $push: {
              items: {
                productId: addToCartDto.productId,
                quantity: addToCartDto.quantity,
                price: product.price,
              },
            },
            $inc: { totalAmount: product.price * addToCartDto.quantity },
          },
          { new: true },
        )
        .exec();
    }
  }

  async updateCartItem(
    userId: string,
    productId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getCart(userId);
    const item = cart.items.find((item) => item.productId === productId);

    if (!item) {
      throw new NotFoundException('Ürün sepette bulunamadı');
    }

    if (updateCartItemDto.quantity === 0) {
      return this.removeFromCart(userId, productId);
    }

    const product = await this.productsService.findOne(productId);
    if (product.stock < updateCartItemDto.quantity) {
      throw new Error('Yetersiz stok');
    }

    const priceDifference =
      (updateCartItemDto.quantity - item.quantity) * item.price;

    return this.cartModel
      .findOneAndUpdate(
        { userId, 'items.productId': productId },
        {
          $set: { 'items.$.quantity': updateCartItemDto.quantity },
          $inc: { totalAmount: priceDifference },
        },
        { new: true },
      )
      .exec();
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    const item = cart.items.find((item) => item.productId === productId);

    if (!item) {
      throw new NotFoundException('Ürün sepette bulunamadı');
    }

    return this.cartModel
      .findOneAndUpdate(
        { userId },
        {
          $pull: { items: { productId } },
          $inc: { totalAmount: -(item.price * item.quantity) },
        },
        { new: true },
      )
      .exec();
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartModel
      .findOneAndUpdate(
        { userId },
        { $set: { items: [], totalAmount: 0 } },
        { new: true },
      )
      .exec();
  }
} 