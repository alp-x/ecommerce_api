import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from './cart.service';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';

describe('CartService', () => {
  let service: CartService;
  let cartModel: Model<CartDocument>;
  let productsService: ProductsService;

  const mockCartModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  const mockProductsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getModelToken(Cart.name),
          useValue: mockCartModel,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartModel = module.get<Model<CartDocument>>(getModelToken(Cart.name));
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should return existing cart', async () => {
      const mockCart = {
        userId: 'user123',
        items: [],
        totalAmount: 0,
      };

      mockCartModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCart),
      });

      const result = await service.getCart('user123');
      expect(result).toEqual(mockCart);
    });

    it('should create new cart if not exists', async () => {
      const mockCart = {
        userId: 'user123',
        items: [],
        totalAmount: 0,
      };

      mockCartModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      mockCartModel.create.mockResolvedValue(mockCart);

      const result = await service.getCart('user123');
      expect(result).toEqual(mockCart);
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      const mockProduct = {
        _id: 'product123',
        price: 100,
        stock: 10,
      };

      const mockCart = {
        userId: 'user123',
        items: [],
        totalAmount: 0,
        save: jest.fn().mockResolvedValue({
          userId: 'user123',
          items: [
            {
              productId: 'product123',
              quantity: 2,
              price: 100,
            },
          ],
          totalAmount: 200,
        }),
      };

      mockProductsService.findOne.mockResolvedValue(mockProduct);
      mockCartModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCart),
      });

      const result = await service.addToCart('user123', {
        productId: 'product123',
        quantity: 2,
      });

      expect(result.totalAmount).toBe(200);
      expect(result.items).toHaveLength(1);
    });
  });
}); 