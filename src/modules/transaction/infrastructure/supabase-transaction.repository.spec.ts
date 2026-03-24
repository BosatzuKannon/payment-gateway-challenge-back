import { SupabaseTransactionRepository } from './supabase-transaction.repository';
import { Transaction } from '../domain/transaction.entity';

// Mock global de Supabase
const mockInsert = jest.fn();
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: mockInsert,
    })),
  })),
}));

describe('SupabaseTransactionRepository', () => {
  let repository: SupabaseTransactionRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUPABASE_URL = 'http://test.com';
    process.env.SUPABASE_KEY = 'key123';
    repository = new SupabaseTransactionRepository();
  });

  const mockTx = new Transaction(
    '123',
    'prod-1',
    2,
    12000,
    'completed',
    new Date(),
    'w-1',
    'Carlos',
    'carlos@test.com',
    'Calle 1',
    'Pasto',
    '520001',
  );

  it('should call supabase.insert with correct data', async () => {
    mockInsert.mockResolvedValue({ error: null });

    await repository.create(mockTx);

    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        id: '123',
        total_amount: 12000,
        customer_email: 'carlos@test.com',
      }),
    ]);
  });

  it('should throw error when supabase insert fails', async () => {
    // Forzamos el error de Supabase
    mockInsert.mockResolvedValue({
      error: { message: 'Database Connection Error' },
    });

    // Verificamos que el repositorio capture ese error y lance el suyo
    await expect(repository.create(mockTx)).rejects.toThrow(
      'Error saving transaction: Database Connection Error',
    );
  });
});
