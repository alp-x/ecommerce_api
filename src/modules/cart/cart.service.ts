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

    let cart = await this.getCart(userId);
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === addToCartDto.productId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += addToCartDto.quantity;
    } else {
      cart.items.push({
        productId: addToCartDto.productId,
        quantity: addToCartDto.quantity,
        price: product.price,
      });
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return cart.save();
  }

  async updateCartItem(
    userId: string,
    productId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Ürün sepette bulunamadı');
    }

    if (updateCartItemDto.quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await this.productsService.findOne(productId);
      if (product.stock < updateCartItemDto.quantity) {
        throw new Error('Yetersiz stok');
      }
      cart.items[itemIndex].quantity = updateCartItemDto.quantity;
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return cart.save();
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartModel.findOneAndUpdate(
      { userId },
      { items: [], totalAmount: 0 },
    );
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Ürün sepette bulunamadı');
    }

    cart.items.splice(itemIndex, 1);
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return cart.save();
  }
} 