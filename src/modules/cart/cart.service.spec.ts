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
    findOneAndUpdate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
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

    // Reset all mocks
    jest.clearAllMocks();
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
      };

      const updatedCart = {
        userId: 'user123',
        items: [
          {
            productId: 'product123',
            quantity: 2,
            price: 100,
          },
        ],
        totalAmount: 200,
      };

      mockProductsService.findOne.mockResolvedValue(mockProduct);
      mockCartModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCart),
      });
      mockCartModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedCart),
      });

      const result = await service.addToCart('user123', {
        productId: 'product123',
        quantity: 2,
      });

      expect(result).toEqual(updatedCart);
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item quantity', async () => {
      const mockCart = {
        userId: 'user123',
        items: [
          {
            productId: 'product123',
            quantity: 1,
            price: 100,
          },
        ],
        totalAmount: 100,
      };

      const mockProduct = {
        _id: 'product123',
        price: 100,
        stock: 10,
      };

      const updatedCart = {
        ...mockCart,
        items: [{ ...mockCart.items[0], quantity: 2 }],
        totalAmount: 200,
      };

      mockCartModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCart),
      });
      mockProductsService.findOne.mockResolvedValue(mockProduct);
      mockCartModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedCart),
      });

      const result = await service.updateCartItem('user123', 'product123', {
        quantity: 2,
      });

      expect(result).toEqual(updatedCart);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const mockCart = {
        userId: 'user123',
        items: [
          {
            productId: 'product123',
            quantity: 1,
            price: 100,
          },
        ],
        totalAmount: 100,
      };

      const updatedCart = {
        userId: 'user123',
        items: [],
        totalAmount: 0,
      };

      mockCartModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCart),
      });
      mockCartModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedCart),
      });

      const result = await service.removeFromCart('user123', 'product123');
      expect(result).toEqual(updatedCart);
    });
  });

  describe('clearCart', () => {
    it('should clear cart', async () => {
      const clearedCart = {
        userId: 'user123',
        items: [],
        totalAmount: 0,
      };

      mockCartModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(clearedCart),
      });

      await service.clearCart('user123');

      expect(mockCartModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 'user123' },
        { $set: { items: [], totalAmount: 0 } },
        { new: true },
      );
    });
  });
}); 