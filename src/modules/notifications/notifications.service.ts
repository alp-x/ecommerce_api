import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  async sendOrderStatusNotification(userId: string, order: any) {
    const notification = {
      type: 'ORDER_STATUS',
      title: 'Sipariş Durumu Güncellendi',
      message: `Siparişinizin durumu ${order.status} olarak güncellendi.`,
      orderId: order._id,
      status: order.status,
      timestamp: new Date(),
    };

    this.notificationsGateway.sendNotification(userId, notification);
  }

  async sendPaymentNotification(userId: string, payment: any) {
    const notification = {
      type: 'PAYMENT',
      title: 'Ödeme Bildirimi',
      message: payment.success
        ? 'Ödemeniz başarıyla gerçekleşti.'
        : 'Ödeme işleminiz başarısız oldu.',
      paymentId: payment.id,
      success: payment.success,
      timestamp: new Date(),
    };

    this.notificationsGateway.sendNotification(userId, notification);
  }

  async sendStockNotification(productId: string, stock: number) {
    const notification = {
      type: 'STOCK',
      title: 'Stok Bildirimi',
      message: `Ürün stok seviyesi ${stock} adet kaldı.`,
      productId,
      stock,
      timestamp: new Date(),
    };

    this.notificationsGateway.sendBroadcast(notification);
  }

  async sendPromotionNotification(promotion: any) {
    const notification = {
      type: 'PROMOTION',
      title: 'Yeni Kampanya',
      message: promotion.description,
      promotionId: promotion._id,
      timestamp: new Date(),
    };

    this.notificationsGateway.sendBroadcast(notification);
  }
} 