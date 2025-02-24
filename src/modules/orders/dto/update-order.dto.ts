import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class UpdateOrderDto {
  @ApiProperty({ description: 'Sipariş durumu', enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ description: 'Kargo takip numarası' })
  @IsString()
  @IsOptional()
  trackingNumber?: string;
} 