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
import { IPaymentPort } from '../domain/payment.port';
import { Result, success, fail } from './result';
import { v4 as uuidv4 } from 'uuid';

export interface CreateTransactionDto {
  productId: string;
  quantity: number;
  paymentToken: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZipCode: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,

    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,

    @Inject(IPaymentPort) 
    private readonly paymentService: IPaymentPort,
  ) {}

  async execute(data: CreateTransactionDto): Promise<Result<Transaction>> {
    
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      return fail(`El producto con ID ${data.productId} no existe.`);
    }

    if (!product.hasEnoughStock(data.quantity)) {
      return fail(
        `Stock insuficiente. Solo quedan ${product.stockQuantity} unidades.`,
      );
    }

    const baseCommission = 10000;
    const totalAmount = (product.price * data.quantity) + baseCommission;
    const amountInCents = totalAmount * 100;
    
    const transactionId = uuidv4();
    const reference = `ORD-${transactionId.substring(0, 8)}`;
    const email = data.customerEmail || 'cliente@ejemplo.com';

    const paymentResult = await this.paymentService.charge(
      data.paymentToken,
      amountInCents,
      reference,
      email
    );

    if (!paymentResult.success) {
      return fail(`El pago fue rechazado por la pasarela: ${paymentResult.error}`);
    }

    product.decreaseStock(data.quantity);

    await this.productRepository.update(product);

    const wompiTransactionId = paymentResult.value;

    const newTransaction = new Transaction(
      transactionId,
      product.id,
      data.quantity,
      totalAmount,
      'completed',
      new Date(),
      wompiTransactionId,
      data.customerName,
      data.customerEmail,
      data.shippingAddress,
      data.shippingCity,
      data.shippingZipCode
    );

    await this.transactionRepository.create(newTransaction);

    return success(newTransaction);
  }
}