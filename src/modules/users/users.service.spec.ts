import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/enums/role.enum';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;

  const mockUserModel = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        roles: [Role.USER],
      };

      const mockUser = {
        _id: 'user-id',
        ...createUserDto,
      };

      mockUserModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));
      mockUserModel.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw error if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        roles: [Role.USER],
      };

      mockUserModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({ _id: 'existing-user' }),
      }));

      await expect(service.create(createUserDto)).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        firstName: 'John',
      };

      mockUserModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockUser),
      }));

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        firstName: 'John',
      };

      mockUserModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockUser),
      }));

      const result = await service.findOne('user-id');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(service.findOne('invalid-id')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        ...updateUserDto,
      };

      mockUserModel.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockUser),
      }));

      const result = await service.update('user-id', updateUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
      };

      mockUserModel.findByIdAndDelete.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockUser),
      }));

      const result = await service.remove('user-id');
      expect(result).toEqual(mockUser);
    });
  });
}); 