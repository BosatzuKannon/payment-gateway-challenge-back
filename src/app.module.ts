import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './modules/stock/infrastructure/stock.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    StockModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
