import { GetProductByIdUseCase } from './get-product-by-id.use-case';
import { NotFoundException } from '@nestjs/common';

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
  let repository: any;

  beforeEach(() => {
    repository = { findById: jest.fn() };
    useCase = new GetProductByIdUseCase(repository);
  });

  it('should return a product if it exists', async () => {
    const mockProduct = { id: '1', name: 'Test' };
    repository.findById.mockResolvedValue(mockProduct);

    const result = await useCase.execute('1');
    expect(result).toEqual(mockProduct);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(useCase.execute('none')).rejects.toThrow(NotFoundException);
  });
});