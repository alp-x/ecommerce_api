import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'Ürün ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Ürün adedi' })
  @IsNumber()
  @Min(1)
  quantity: number;
} 