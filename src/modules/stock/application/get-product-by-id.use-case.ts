import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '../domain/product.repository';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
