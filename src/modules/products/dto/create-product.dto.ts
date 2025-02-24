import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsObject, Min, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Ürün adı' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Ürün açıklaması' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Ürün fiyatı' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Stok miktarı' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ description: 'Ürün kategorisi' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Ürün görselleri', required: false })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ description: 'Ürün özellikleri', required: false })
  @IsObject()
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiProperty({ description: 'Ürün aktif mi?', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'İndirim oranı', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPercentage?: number;

  @ApiProperty({ description: 'Satıcı ID' })
  @IsString()
  sellerId: string;

  @ApiProperty({ description: 'SKU kodu' })
  @IsString()
  sku: string;
} 