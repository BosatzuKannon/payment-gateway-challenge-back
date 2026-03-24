import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { CreateTransactionUseCase } from '../application/create-transaction.use-case';
import { TRANSACTION_REPOSITORY } from '../domain/transaction.repository';
import { SupabaseTransactionRepository } from './supabase-transaction.repository';
import { StockModule } from '../../stock/infrastructure/stock.module';

import { IPaymentPort } from '../domain/payment.port';
import { WompiAdapter } from './wompi.adapter';

@Module({
  imports: [StockModule],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: SupabaseTransactionRepository,
    },
    {
      provide: IPaymentPort,
      useClass: WompiAdapter,
    },
  ],
})
export class TransactionModule {}
