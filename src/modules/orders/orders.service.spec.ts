import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrdersService } from './orders.service';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderModel: Model<OrderDocument>;
  let cartService: CartService;
  let productsService: ProductsService;

  const mockOrderModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCartService = {
    getCart: jest.fn(),
    clearCart: jest.fn(),
  };

  const mockProductsService = {
    findOne: jest.fn(),
    updateStock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel,
        },
        {
          provide: CartService,
          useValue: mockCartService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderModel = module.get<Model<OrderDocument>>(getModelToken(Order.name));
    cartService = module.get<CartService>(CartService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const mockCart = {
        items: [
          {
            productId: 'product123',
            quantity: 2,
            price: 100,
          },
        ],
        totalAmount: 200,
      };

      const mockProduct = {
        _id: 'product123',
        name: 'Test Product',
        price: 100,
        stock: 10,
      };

      const mockOrder = {
        userId: 'user123',
        items: [
          {
            productId: 'product123',
            productName: 'Test Product',
            quantity: 2,
            price: 100,
          },
        ],
        totalAmount: 200,
        status: OrderStatus.PENDING,
        shippingAddress: '123 Test St',
      };

      mockCartService.getCart.mockResolvedValue(mockCart);
      mockProductsService.findOne.mockResolvedValue(mockProduct);
      mockOrderModel.create.mockResolvedValue(mockOrder);

      const result = await service.create('user123', {
        shippingAddress: '123 Test St',
      });

      expect(result).toEqual(mockOrder);
      expect(mockCartService.clearCart).toHaveBeenCalledWith('user123');
      expect(mockProductsService.updateStock).toHaveBeenCalledWith(
        'product123',
        2,
      );
    });

    it('should throw error if cart is empty', async () => {
      mockCartService.getCart.mockResolvedValue({ items: [] });

      await expect(
        service.create('user123', { shippingAddress: '123 Test St' }),
      ).rejects.toThrow('Sepet boş');
    });
  });

  describe('findAll', () => {
    it('should return all orders for user', async () => {
      const mockOrders = [
        {
          userId: 'user123',
          items: [],
          totalAmount: 200,
          status: OrderStatus.PENDING,
        },
      ];

      mockOrderModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockOrders),
        }),
      });

      const result = await service.findAll('user123');
      expect(result).toEqual(mockOrders);
    });
  });
}); 