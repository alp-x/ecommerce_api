import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartService.getCart(userId);
    if (!cart.items.length) {
      throw new Error('Sepet boş');
    }

    // Stok kontrolü ve ürün detaylarını alma
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productsService.findOne(item.productId);
        if (product.stock < item.quantity) {
          throw new Error(`${product.name} için yetersiz stok`);
        }
        return {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        };
      }),
    );

    // Siparişi oluştur
    const order = await this.orderModel.create({
      userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      status: OrderStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress,
    });

    // Stokları güncelle
    await Promise.all(
      order.items.map((item) =>
        this.productsService.updateStock(item.productId, item.quantity),
      ),
    );

    // Sepeti temizle
    await this.cartService.clearCart(userId);

    return order;
  }

  async findAll(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderModel.findOne({ _id: orderId, userId }).exec();
    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı');
    }
    return order;
  }

  async update(
    userId: string,
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.findOne(userId, orderId);
    
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    if (updateOrderDto.trackingNumber) {
      order.trackingNumber = updateOrderDto.trackingNumber;
    }

    return order.save();
  }

  async cancel(userId: string, orderId: string): Promise<Order> {
    const order = await this.findOne(userId, orderId);
    
    if (order.status !== OrderStatus.PENDING) {
      throw new Error('Bu sipariş iptal edilemez');
    }

    order.status = OrderStatus.CANCELLED;

    // Stokları geri ekle
    await Promise.all(
      order.items.map((item) =>
        this.productsService.updateStock(item.productId, -item.quantity),
      ),
    );

    return order.save();
  }
} 