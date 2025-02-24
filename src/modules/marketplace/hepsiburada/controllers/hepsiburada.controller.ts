import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { HepsiburadaService } from '../services/hepsiburada.service';

@ApiTags('hepsiburada')
@Controller('marketplace/hepsiburada')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HepsiburadaController {
  constructor(private readonly hepsiburadaService: HepsiburadaService) {}

  @Post('products/:productId/sync')
  @ApiOperation({ summary: 'Ürünü Hepsiburada ile senkronize et' })
  async syncProduct(
    @Param('productId') productId: string,
    @Body() data: any
  ) {
    return this.hepsiburadaService.syncProduct(productId, data);
  }

  @Post('products/:productId/stock')
  @ApiOperation({ summary: 'Ürün stokunu güncelle' })
  async updateStock(
    @Param('productId') productId: string,
    @Body('stock') stock: number
  ) {
    return this.hepsiburadaService.updateStock(productId, stock);
  }

  @Post('products/:productId/price')
  @ApiOperation({ summary: 'Ürün fiyatını güncelle' })
  async updatePrice(
    @Param('productId') productId: string,
    @Body('price') price: number
  ) {
    return this.hepsiburadaService.updatePrice(productId, price);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Hepsiburada siparişlerini getir' })
  async getOrders(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.hepsiburadaService.getOrders(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  @Post('orders/:orderId/status')
  @ApiOperation({ summary: 'Sipariş durumunu güncelle' })
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string
  ) {
    return this.hepsiburadaService.updateOrderStatus(orderId, status);
  }
} 