import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import { type IProductRepository, PRODUCT_REPOSITORY } from '../domain/product.repository';

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}