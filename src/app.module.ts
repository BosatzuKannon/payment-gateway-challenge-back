import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './modules/stock/infrastructure/stock.module';
import { TransactionModule } from './modules/transaction/infrastructure/transaction.module';

@Module({
  imports: [ConfigModule.forRoot(), StockModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
