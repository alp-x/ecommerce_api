import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('orders/:orderId/process')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ödeme işlemini gerçekleştir' })
  async processPayment(
    @Request() req,
    @Param('orderId') orderId: string,
    @Body() processPaymentDto: ProcessPaymentDto,
  ) {
    return this.paymentService.processPayment(
      req.user.userId,
      orderId,
      processPaymentDto,
    );
  }

  @Post('orders/:orderId/create-payment-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ödeme niyeti oluştur' })
  async createPaymentIntent(@Request() req, @Param('orderId') orderId: string) {
    return this.paymentService.createPaymentIntent(req.user.userId, orderId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Request() req: RawBodyRequest<Request>,
  ) {
    return this.paymentService.handleWebhook(signature, req.rawBody);
  }
} 