import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { OrdersService } from '../orders/orders.service';
import Stripe from 'stripe';

jest.mock('stripe');

describe('PaymentService', () => {
  let service: PaymentService;
  let ordersService: OrdersService;
  let configService: ConfigService;

  const mockOrdersService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    ordersService = module.get<OrdersService>(OrdersService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      const mockOrder = {
        totalAmount: 100,
      };

      const mockPaymentIntent = {
        id: 'pi_123',
        status: 'succeeded',
      };

      mockOrdersService.findOne.mockResolvedValue(mockOrder);
      (Stripe.prototype.paymentIntents.create as jest.Mock).mockResolvedValue(
        mockPaymentIntent,
      );

      const result = await service.processPayment('user123', 'order123', {
        paymentMethodId: 'pm_123',
      });

      expect(result.success).toBe(true);
      expect(result.paymentId).toBe('pi_123');
      expect(mockOrdersService.update).toHaveBeenCalledWith('user123', 'order123', {
        status: 'processing',
      });
    });

    it('should handle payment requiring additional action', async () => {
      const mockOrder = {
        totalAmount: 100,
      };

      const mockPaymentIntent = {
        status: 'requires_action',
        client_secret: 'secret_123',
      };

      mockOrdersService.findOne.mockResolvedValue(mockOrder);
      (Stripe.prototype.paymentIntents.create as jest.Mock).mockResolvedValue(
        mockPaymentIntent,
      );

      const result = await service.processPayment('user123', 'order123', {
        paymentMethodId: 'pm_123',
      });

      expect(result.success).toBe(false);
      expect(result.requiresAction).toBe(true);
      expect(result.clientSecret).toBe('secret_123');
    });
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent', async () => {
      const mockOrder = {
        totalAmount: 100,
      };

      const mockPaymentIntent = {
        client_secret: 'secret_123',
      };

      mockOrdersService.findOne.mockResolvedValue(mockOrder);
      (Stripe.prototype.paymentIntents.create as jest.Mock).mockResolvedValue(
        mockPaymentIntent,
      );

      const result = await service.createPaymentIntent('user123', 'order123');

      expect(result.clientSecret).toBe('secret_123');
    });
  });

  describe('handleWebhook', () => {
    it('should handle webhook events', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
          },
        },
      };

      (Stripe.prototype.webhooks.constructEvent as jest.Mock).mockReturnValue(
        mockEvent,
      );

      const result = await service.handleWebhook('signature', Buffer.from(''));

      expect(result.received).toBe(true);
    });

    it('should handle webhook errors', async () => {
      (Stripe.prototype.webhooks.constructEvent as jest.Mock).mockImplementation(
        () => {
          throw new Error('Invalid signature');
        },
      );

      await expect(
        service.handleWebhook('invalid_signature', Buffer.from('')),
      ).rejects.toThrow('Webhook Error: Invalid signature');
    });
  });
}); 