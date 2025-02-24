import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { HepsiburadaService } from '../services/hepsiburada.service';
import { HepsiburadaProduct } from '../schemas/hepsiburada-product.schema';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HepsiburadaService', () => {
  let service: HepsiburadaService;
  let model: Model<HepsiburadaProduct>;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'HEPSIBURADA_API_URL':
          return 'https://api.hepsiburada.test';
        case 'HEPSIBURADA_MERCHANT_ID':
          return 'test_merchant_id';
        case 'HEPSIBURADA_API_KEY':
          return 'test_api_key';
        case 'HEPSIBURADA_API_SECRET':
          return 'test_api_secret';
        default:
          return null;
      }
    }),
  };

  const mockHepsiburadaProduct = {
    productId: 'test_product_id',
    merchantId: 'test_merchant_id',
    hbProductId: 'test_hb_product_id',
    listPrice: 100,
    salePrice: 90,
    stockAmount: 50,
    status: 'Active',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HepsiburadaService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getModelToken(HepsiburadaProduct.name),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockHepsiburadaProduct),
            findOneAndUpdate: jest.fn().mockResolvedValue(mockHepsiburadaProduct),
            updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<HepsiburadaService>(HepsiburadaService);
    model = module.get<Model<HepsiburadaProduct>>(
      getModelToken(HepsiburadaProduct.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncProduct', () => {
    it('should sync product successfully', async () => {
      const mockProductData = {
        price: 100,
        stock: 50,
        name: 'Test Product',
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'test_token' },
      });

      mockedAxios.post.mockResolvedValueOnce({
        data: { hbProductId: 'new_hb_product_id' },
      });

      const result = await service.syncProduct('test_product_id', mockProductData);

      expect(result).toEqual({ hbProductId: 'new_hb_product_id' });
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateStock', () => {
    it('should update stock successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'test_token' },
      });

      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const result = await service.updateStock('test_product_id', 100);

      expect(result).toEqual({ success: true, stock: 100 });
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });

    it('should throw error when product not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateStock('invalid_id', 100)).rejects.toThrow(
        'Hepsiburada ürün eşleşmesi bulunamadı',
      );
    });
  });

  describe('updatePrice', () => {
    it('should update price successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'test_token' },
      });

      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const result = await service.updatePrice('test_product_id', 150);

      expect(result).toEqual({ success: true, price: 150 });
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('getOrders', () => {
    it('should get orders successfully', async () => {
      const mockOrders = [
        { id: 'order1', status: 'pending' },
        { id: 'order2', status: 'shipped' },
      ];

      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'test_token' },
      });

      mockedAxios.get.mockResolvedValueOnce({
        data: mockOrders,
      });

      const result = await service.getOrders(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
      );

      expect(result).toEqual(mockOrders);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'test_token' },
      });

      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const result = await service.updateOrderStatus('test_order_id', 'shipped');

      expect(result).toEqual({
        success: true,
        orderId: 'test_order_id',
        status: 'shipped',
      });
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });
}); 