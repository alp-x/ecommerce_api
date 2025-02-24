import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let gateway: NotificationsGateway;

  const mockNotificationsGateway = {
    sendNotification: jest.fn(),
    sendBroadcast: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NotificationsGateway,
          useValue: mockNotificationsGateway,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    gateway = module.get<NotificationsGateway>(NotificationsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendOrderStatusNotification', () => {
    it('should send order status notification', async () => {
      const mockOrder = {
        _id: 'order123',
        status: 'processing',
      };

      await service.sendOrderStatusNotification('user123', mockOrder);

      expect(gateway.sendNotification).toHaveBeenCalledWith(
        'user123',
        expect.objectContaining({
          type: 'ORDER_STATUS',
          orderId: 'order123',
          status: 'processing',
        }),
      );
    });
  });

  describe('sendPaymentNotification', () => {
    it('should send successful payment notification', async () => {
      const mockPayment = {
        id: 'payment123',
        success: true,
      };

      await service.sendPaymentNotification('user123', mockPayment);

      expect(gateway.sendNotification).toHaveBeenCalledWith(
        'user123',
        expect.objectContaining({
          type: 'PAYMENT',
          paymentId: 'payment123',
          success: true,
        }),
      );
    });

    it('should send failed payment notification', async () => {
      const mockPayment = {
        id: 'payment123',
        success: false,
      };

      await service.sendPaymentNotification('user123', mockPayment);

      expect(gateway.sendNotification).toHaveBeenCalledWith(
        'user123',
        expect.objectContaining({
          type: 'PAYMENT',
          paymentId: 'payment123',
          success: false,
        }),
      );
    });
  });

  describe('sendStockNotification', () => {
    it('should send stock notification', async () => {
      await service.sendStockNotification('product123', 5);

      expect(gateway.sendBroadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'STOCK',
          productId: 'product123',
          stock: 5,
        }),
      );
    });
  });

  describe('sendPromotionNotification', () => {
    it('should send promotion notification', async () => {
      const mockPromotion = {
        _id: 'promo123',
        description: 'Summer sale!',
      };

      await service.sendPromotionNotification(mockPromotion);

      expect(gateway.sendBroadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'PROMOTION',
          promotionId: 'promo123',
          message: 'Summer sale!',
        }),
      );
    });
  });
}); 