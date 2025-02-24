import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsOptional } from 'class-validator';

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Stripe payment method ID' })
  @IsString()
  paymentMethodId: string;

  @ApiProperty({ description: 'Başarılı ödeme sonrası yönlendirilecek URL' })
  @IsUrl()
  @IsOptional()
  returnUrl?: string;
} 