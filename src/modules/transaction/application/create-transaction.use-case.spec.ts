import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase, CreateTransactionDto } from './create-transaction.use-case';
import { TRANSACTION_REPOSITORY } from '../domain/transaction.repository';
import { PRODUCT_REPOSITORY } from '../../stock/domain/product.repository';
import { IPaymentPort } from '../domain/payment.port';
import { Transaction } from '../domain/transaction.entity';

jest.mock('uuid', () => ({
  v4: () => '1234-5678-9012'
}));

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepo: any;
  let productRepo: any;
  let paymentService: any;

  beforeEach(async () => {
    transactionRepo = { create: jest.fn() };
    productRepo = { findById: jest.fn(), update: jest.fn() };
    paymentService = { charge: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        { provide: TRANSACTION_REPOSITORY, useValue: transactionRepo },
        { provide: PRODUCT_REPOSITORY, useValue: productRepo },
        { provide: IPaymentPort, useValue: paymentService },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
  });

  it('should create a transaction successfully (Happy Path)', async () => {
    const mockProduct = {
      id: 'prod-123',
      price: 1000,
      stockQuantity: 10,
      hasEnoughStock: jest.fn().mockReturnValue(true),
      decreaseStock: jest.fn(),
    };
    productRepo.findById.mockResolvedValue(mockProduct);
    paymentService.charge.mockResolvedValue({ success: true, value: 'wompi_ref_123' });

    const dto: CreateTransactionDto = {
      productId: 'prod-123',
      quantity: 2,
      paymentToken: 'tok_test',
      customerName: 'Carlos Jaramillo',
      customerEmail: 'carlos@test.com',
      shippingAddress: 'Calle 123',
      shippingCity: 'Pasto',
      shippingZipCode: '520001'
    };

    const result = await useCase.execute(dto);

    // Verificamos usando la estructura de result.ts
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBeInstanceOf(Transaction);
      expect(result.value.totalAmount).toBe(12000); 
    }
    expect(transactionRepo.create).toHaveBeenCalled();
    expect(productRepo.update).toHaveBeenCalled();
  });

  it('should return fail if product is not found', async () => {
    productRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute({ productId: 'none', quantity: 1 } as any);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('no existe');
    }
  });

  it('should return fail if payment is rejected', async () => {
    const mockProduct = {
      id: 'prod-1',
      price: 1000,
      hasEnoughStock: jest.fn().mockReturnValue(true),
    };
    productRepo.findById.mockResolvedValue(mockProduct);
    paymentService.charge.mockResolvedValue({ success: false, error: 'DECLINED' });

    const result = await useCase.execute({ productId: 'prod-1', quantity: 1 } as any);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('rechazado');
    }
  });
});