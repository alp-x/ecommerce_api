import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'Yeni ürün adedi' })
  @IsNumber()
  @Min(0)
  quantity: number;
} 