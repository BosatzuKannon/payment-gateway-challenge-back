import { SupabaseProductRepository } from './supabase-product.repository';
import { Product } from '../domain/product.entity';

// Mock estructurado para encadenamiento de Supabase
const mockSupabaseQuery = {
  select: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => mockSupabaseQuery),
  })),
}));

describe('SupabaseProductRepository', () => {
  let repository: SupabaseProductRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUPABASE_URL = 'http://test.com';
    process.env.SUPABASE_KEY = 'key123';
    repository = new SupabaseProductRepository();
  });

  const mockProductRow = {
    id: '1',
    name: 'P1',
    price: 10,
    stock_quantity: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it('should find all products', async () => {
    // Simulamos que el objeto de la consulta se resuelve como una promesa
    mockSupabaseQuery.order.mockReturnValue(
      Promise.resolve({ data: [mockProductRow], error: null }),
    );

    const result = await repository.findAll();
    expect(result[0]).toBeInstanceOf(Product);
    expect(result[0].id).toBe('1');
  });

  it('should find product by id', async () => {
    mockSupabaseQuery.single.mockReturnValue(
      Promise.resolve({ data: mockProductRow, error: null }),
    );

    const result = await repository.findById('1');
    expect(result?.id).toBe('1');
  });

  it('should throw error if findAll fails', async () => {
    mockSupabaseQuery.order.mockReturnValue(
      Promise.resolve({ data: null, error: { message: 'Fail' } }),
    );
    await expect(repository.findAll()).rejects.toThrow(
      'Error fetching products: Fail',
    );
  });
});
