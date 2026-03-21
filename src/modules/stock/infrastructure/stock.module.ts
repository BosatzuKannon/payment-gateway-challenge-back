import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { GetAllProductsUseCase } from '../application/get-all-products.use-case';
import { GetProductByIdUseCase } from '../application/get-product-by-id.use-case';
import { PRODUCT_REPOSITORY } from '../domain/product.repository';
import { SupabaseProductRepository } from './supabase-product.repository';

@Module({
  controllers: [StockController],
  providers: [
    GetAllProductsUseCase,
    GetProductByIdUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: SupabaseProductRepository,
    },
  ],
})
export class StockModule {}
