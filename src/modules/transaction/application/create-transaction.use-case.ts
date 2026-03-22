import { Injectable, Inject } from '@nestjs/common';
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../domain/transaction.repository';
import { Transaction } from '../domain/transaction.entity';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../stock/domain/product.repository';
import { Result, success, fail } from './result';
import { v4 as uuidv4 } from 'uuid';

export interface CreateTransactionDto {
  productId: string;
  quantity: number;
  paymentToken: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,

    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(data: CreateTransactionDto): Promise<Result<Transaction>> {
    // Looking for the product
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      return fail(`El producto con ID ${data.productId} no existe.`);
    }

    // Validating the stock
    if (!product.hasEnoughStock(data.quantity)) {
      return fail(
        `Stock insuficiente. Solo quedan ${product.stockQuantity} unidades.`,
      );
    }

    // Simulated token
    if (data.paymentToken === 'FAIL_TOKEN') {
      return fail('El pago fue rechazado por la pasarela.');
    }

    // Decrease in product stock
    product.decreaseStock(data.quantity);

    // Updating supabase
    await this.productRepository.update(product);

    // Calculating the total and creating the transaction
    const totalAmount = product.price * data.quantity;
    const newTransaction = new Transaction(
      uuidv4(),
      product.id,
      data.quantity,
      totalAmount,
      'completed',
      new Date(),
    );

    // Saving transaction in supabase
    await this.transactionRepository.create(newTransaction);

    return success(newTransaction);
  }
}
