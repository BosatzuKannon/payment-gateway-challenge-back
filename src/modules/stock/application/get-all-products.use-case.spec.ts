import { GetAllProductsUseCase } from './get-all-products.use-case';

describe('GetAllProductsUseCase', () => {
  it('should return all products from repository', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' },
    ];
    const repository = { findAll: jest.fn().mockResolvedValue(mockProducts) };
    const useCase = new GetAllProductsUseCase(repository as any);

    const result = await useCase.execute();

    expect(result).toEqual(mockProducts);
    expect(repository.findAll).toHaveBeenCalled();
  });
});
