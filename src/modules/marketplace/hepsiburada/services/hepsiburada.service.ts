import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { HepsiburadaProduct } from '../schemas/hepsiburada-product.schema';

@Injectable()
export class HepsiburadaService {
  private readonly logger = new Logger(HepsiburadaService.name);
  private readonly apiUrl: string;
  private readonly merchantId: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(
    @InjectModel(HepsiburadaProduct.name)
    private readonly hepsiburadaProductModel: Model<HepsiburadaProduct>,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('HEPSIBURADA_API_URL');
    this.merchantId = this.configService.get<string>('HEPSIBURADA_MERCHANT_ID');
    this.apiKey = this.configService.get<string>('HEPSIBURADA_API_KEY');
    this.apiSecret = this.configService.get<string>('HEPSIBURADA_API_SECRET');
  }

  private async getAuthToken(): Promise<string> {
    try {
      const response = await axios.post(`${this.apiUrl}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: this.apiKey,
        client_secret: this.apiSecret,
      });
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Hepsiburada token alınamadı:', error);
      throw error;
    }
  }

  async syncProduct(productId: string, data: any) {
    try {
      const token = await this.getAuthToken();
      const response = await axios.post(
        `${this.apiUrl}/products/import`,
        {
          items: [{
            merchantId: this.merchantId,
            productId: productId,
            price: data.price,
            availableStock: data.stock,
            ...data
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await this.hepsiburadaProductModel.findOneAndUpdate(
        { productId },
        {
          merchantId: this.merchantId,
          hbProductId: response.data.hbProductId,
          listPrice: data.price,
          salePrice: data.price,
          stockAmount: data.stock,
          lastSyncDate: new Date()
        },
        { upsert: true }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Ürün senkronizasyonu başarısız (${productId}):`, error);
      throw error;
    }
  }

  async updateStock(productId: string, stock: number) {
    try {
      const token = await this.getAuthToken();
      const hbProduct = await this.hepsiburadaProductModel.findOne({ productId });
      
      if (!hbProduct) {
        throw new Error('Hepsiburada ürün eşleşmesi bulunamadı');
      }

      await axios.post(
        `${this.apiUrl}/inventory/update`,
        {
          items: [{
            merchantId: this.merchantId,
            productId: hbProduct.hbProductId,
            quantity: stock
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await this.hepsiburadaProductModel.updateOne(
        { productId },
        { 
          stockAmount: stock,
          lastSyncDate: new Date()
        }
      );

      return { success: true, stock };
    } catch (error) {
      this.logger.error(`Stok güncellemesi başarısız (${productId}):`, error);
      throw error;
    }
  }

  async updatePrice(productId: string, price: number) {
    try {
      const token = await this.getAuthToken();
      const hbProduct = await this.hepsiburadaProductModel.findOne({ productId });
      
      if (!hbProduct) {
        throw new Error('Hepsiburada ürün eşleşmesi bulunamadı');
      }

      await axios.post(
        `${this.apiUrl}/prices/update`,
        {
          items: [{
            merchantId: this.merchantId,
            productId: hbProduct.hbProductId,
            price: price
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await this.hepsiburadaProductModel.updateOne(
        { productId },
        { 
          listPrice: price,
          salePrice: price,
          lastSyncDate: new Date()
        }
      );

      return { success: true, price };
    } catch (error) {
      this.logger.error(`Fiyat güncellemesi başarısız (${productId}):`, error);
      throw error;
    }
  }

  async getOrders(startDate?: Date, endDate?: Date) {
    try {
      const token = await this.getAuthToken();
      const response = await axios.get(
        `${this.apiUrl}/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            merchantId: this.merchantId,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
          }
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Siparişler alınamadı:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    try {
      const token = await this.getAuthToken();
      await axios.post(
        `${this.apiUrl}/orders/${orderId}/status`,
        {
          merchantId: this.merchantId,
          status: status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return { success: true, orderId, status };
    } catch (error) {
      this.logger.error(`Sipariş durumu güncellenemedi (${orderId}):`, error);
      throw error;
    }
  }
} 