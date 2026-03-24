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
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'The unique ID of the product',
    example: 'prod-123',
  })
  productId: string;

  @ApiProperty({ description: 'Number of units to buy', example: 1 })
  quantity: number;

  @ApiProperty({
    description: 'Credit card token provided by Wompi widget',
    example: 'tok_test_123',
  })
  paymentToken: string;

  @ApiProperty({
    description: 'Full name of the customer',
    example: 'Carlos Jaramillo',
  })
  customerName: string;

  @ApiProperty({
    description: 'Valid email address for transaction receipts',
    example: 'carlos@test.com',
  })
  customerEmail: string;

  @ApiProperty({
    description: 'Detailed shipping address',
    example: 'Calle 123 #45-67',
  })
  shippingAddress: string;

  @ApiProperty({ description: 'City for delivery', example: 'Pasto' })
  shippingCity: string;

  @ApiProperty({ description: 'ZIP or Postal code', example: '520001' })
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
    // 1. Validación de existencia
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      return fail(`El producto con ID ${data.productId} no existe.`);
    }

    // 2. Validación de Stock (Lógica de Dominio)
    if (!product.hasEnoughStock(data.quantity)) {
      return fail(
        `Stock insuficiente. Solo quedan ${product.stockQuantity} unidades.`,
      );
    }

    // 3. Cálculos financieros
    const baseCommission = 10000;
    const totalAmount = product.price * data.quantity + baseCommission;
    const amountInCents = totalAmount * 100;

    const transactionId = uuidv4();
    const reference = `ORD-${transactionId.substring(0, 8)}`;
    const email = data.customerEmail || 'cliente@ejemplo.com';

    // 4. Intento de cobro con Pasarela (Port/Adapter)
    const paymentResult = await this.paymentService.charge(
      data.paymentToken,
      amountInCents,
      reference,
      email,
    );

    if (!paymentResult.success) {
      return fail(
        `El pago fue rechazado por la pasarela: ${paymentResult.error}`,
      );
    }

    // 5. Actualización de Stock (Persistencia en Stock)
    product.decreaseStock(data.quantity);
    await this.productRepository.update(product);

    // 6. Creación de la Entidad de Transacción
    // NOTA: Asegúrate que el orden coincida con el constructor de Transaction.entity
    const newTransaction = new Transaction(
      transactionId,
      product.id,
      data.quantity,
      totalAmount,
      'completed', // Status
      new Date(),
      paymentResult.value, // wompiTransactionId
      data.customerName,
      data.customerEmail,
      data.shippingAddress,
      data.shippingCity,
      data.shippingZipCode,
    );

    // 7. Persistencia de la Transacción
    await this.transactionRepository.create(newTransaction);

    return success(newTransaction);
  }
}
