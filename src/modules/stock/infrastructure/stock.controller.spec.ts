import { StockController } from './stock.controller';

describe('StockController', () => {
  let controller: StockController;
  let getAllUseCase: any;
  let getByIdUseCase: any;

  beforeEach(() => {
    getAllUseCase = { execute: jest.fn() };
    getByIdUseCase = { execute: jest.fn() };
    controller = new StockController(getAllUseCase, getByIdUseCase);
  });

  it('should return all products', async () => {
    const mockProducts = [{ id: '1' }];
    getAllUseCase.execute.mockResolvedValue(mockProducts);
    expect(await controller.getAllProducts()).toBe(mockProducts);
  });

  it('should return a product by id', async () => {
    const mockProduct = { id: '1' };
    getByIdUseCase.execute.mockResolvedValue(mockProduct);
    expect(await controller.getProductById('1')).toBe(mockProduct);
  });
});