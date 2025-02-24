import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HepsiburadaController } from './controllers/hepsiburada.controller';
import { HepsiburadaService } from './services/hepsiburada.service';
import { HepsiburadaProduct, HepsiburadaProductSchema } from './schemas/hepsiburada-product.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: HepsiburadaProduct.name, schema: HepsiburadaProductSchema }
    ])
  ],
  controllers: [HepsiburadaController],
  providers: [HepsiburadaService],
  exports: [HepsiburadaService]
})
export class HepsiburadaModule {} 