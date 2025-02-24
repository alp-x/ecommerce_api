import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async processPayment(
    userId: string,
    orderId: string,
    paymentDto: ProcessPaymentDto,
  ) {
    const order = await this.ordersService.findOne(userId, orderId);

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100), // Stripe uses cents
        currency: 'try',
        payment_method: paymentDto.paymentMethodId,
        confirm: true,
        return_url: paymentDto.returnUrl,
      });

      if (paymentIntent.status === 'succeeded') {
        await this.ordersService.update(userId, orderId, {
          status: 'processing',
        });

        return {
          success: true,
          paymentId: paymentIntent.id,
        };
      }

      return {
        success: false,
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      throw new Error(`Ödeme işlemi başarısız: ${error.message}`);
    }
  }

  async createPaymentIntent(userId: string, orderId: string) {
    const order = await this.ordersService.findOne(userId, orderId);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: 'try',
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET'),
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          // Ödeme başarılı olduğunda sipariş durumunu güncelle
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          // Burada sipariş ID'sini metadata'dan alabilirsiniz
          break;

        case 'payment_intent.payment_failed':
          // Ödeme başarısız olduğunda gerekli işlemleri yap
          break;
      }

      return { received: true };
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }
} 