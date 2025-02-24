import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Teslimat adresi' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;
} 