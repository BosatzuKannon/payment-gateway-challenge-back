import { Controller, Get, Param } from '@nestjs/common';
import { GetAllProductsUseCase } from '../application/get-all-products.use-case';
import { GetProductByIdUseCase } from '../application/get-product-by-id.use-case';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Product } from '../domain/product.entity';

@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  @Get('products')
  @ApiOperation({ summary: 'Get all available products in stock' })
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    type: [Product],
  })
  async getAllProducts() {
    const products = await this.getAllProductsUseCase.execute();
    return products;
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get a specific product by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the product details.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async getProductById(@Param('id') id: string) {
    return await this.getProductByIdUseCase.execute(id);
  }
}
