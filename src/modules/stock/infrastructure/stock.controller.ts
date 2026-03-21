import { Controller, Get, Param } from '@nestjs/common';
import { GetAllProductsUseCase } from '../application/get-all-products.use-case';
import { GetProductByIdUseCase } from '../application/get-product-by-id.use-case';

@Controller('stock')
export class StockController {
  constructor(
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  @Get('products')
  async getAllProducts() {
    const products = await this.getAllProductsUseCase.execute();
    return products;
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return await this.getProductByIdUseCase.execute(id);
  }
}