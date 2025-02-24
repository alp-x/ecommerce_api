import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from './products.service';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: Model<ProductDocument>;

  const mockProductModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get<Model<ProductDocument>>(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all active products', async () => {
      const mockProducts = [
        {
          name: 'Product 1',
          price: 100,
          isActive: true,
        },
        {
          name: 'Product 2',
          price: 200,
          isActive: true,
        },
      ];

      mockProductModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProducts),
      });

      const filterDto: FilterProductDto = {};
      const result = await service.findAll(filterDto);
      
      expect(result).toEqual(mockProducts);
      expect(mockProductModel.find).toHaveBeenCalledWith({ isActive: true });
    });

    it('should filter products by category', async () => {
      const filterDto: FilterProductDto = { category: 'electronics' };
      
      mockProductModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.findAll(filterDto);
      
      expect(mockProductModel.find).toHaveBeenCalledWith({
        isActive: true,
        category: 'electronics',
      });
    });

    it('should filter products by price range', async () => {
      const filterDto: FilterProductDto = { minPrice: 100, maxPrice: 200 };
      
      mockProductModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.findAll(filterDto);
      
      expect(mockProductModel.find).toHaveBeenCalledWith({
        isActive: true,
        price: { $gte: 100, $lte: 200 },
      });
    });

    it('should search products by name or description', async () => {
      const filterDto: FilterProductDto = { search: 'test' };
      
      mockProductModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.findAll(filterDto);
      
      expect(mockProductModel.find).toHaveBeenCalledWith({
        isActive: true,
        $or: [
          { name: { $regex: 'test', $options: 'i' } },
          { description: { $regex: 'test', $options: 'i' } },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const mockProduct = {
        _id: 'product-id',
        name: 'Test Product',
        price: 100,
      };

      mockProductModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await service.findOne('product-id');
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('invalid-id')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'Description',
        price: 100,
        category: 'electronics',
        stock: 10,
        sellerId: 'seller-123',
        sku: 'PRD-123',
        imageUrl: 'https://example.com/image.jpg',
        isActive: true
      };

      const mockProduct = {
        _id: 'new-product-id',
        ...createProductDto,
      };

      mockProductModel.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
      };

      const mockProduct = {
        _id: 'product-id',
        ...updateProductDto,
      };

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await service.update('product-id', updateProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const mockProduct = {
        _id: 'product-id',
        name: 'Product to delete',
      };

      mockProductModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await service.remove('product-id');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getBySellerId', () => {
    it('should return all products for a seller', async () => {
      const mockProducts = [
        {
          _id: 'product-1',
          name: 'Product 1',
          sellerId: 'seller-id',
        },
        {
          _id: 'product-2',
          name: 'Product 2',
          sellerId: 'seller-id',
        },
      ];

      mockProductModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProducts),
      });

      const result = await service.getBySellerId('seller-id');
      expect(result).toEqual(mockProducts);
      expect(mockProductModel.find).toHaveBeenCalledWith({ sellerId: 'seller-id' });
    });
  });
}); 