import { Test } from '@nestjs/testing';
import { StockModule } from './stock/infrastructure/stock.module';
import { TransactionModule } from './transaction/infrastructure/transaction.module';
import { AppModule } from '../app.module';

// MOCK DE UUID PARA EVITAR EL ERROR DE PARSEO
jest.mock('uuid', () => ({
  v4: () => '1234-5678-9012',
}));

describe('Modules Definition', () => {
  it('should verify StockModule is defined', async () => {
    const module = await Test.createTestingModule({
      imports: [StockModule],
    }).compile();
    expect(module).toBeDefined();
  });

  it('should verify TransactionModule is defined', async () => {
    const module = await Test.createTestingModule({
      imports: [TransactionModule],
    }).compile();
    expect(module).toBeDefined();
  });

  it('should verify AppModule is defined', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    expect(module).toBeDefined();
  });
});
