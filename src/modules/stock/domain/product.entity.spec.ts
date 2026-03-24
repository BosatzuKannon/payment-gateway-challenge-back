import { Product } from './product.entity';

describe('Product Entity', () => {
  const createMockProduct = (stock: number) => new Product(
    '1', 'Test', 'Desc', 1000, stock, 'img.jpg', new Date(), new Date()
  );

  it('should decrease stock when enough quantity is available', () => {
    const product = createMockProduct(10);
    product.decreaseStock(4);
    expect(product.stockQuantity).toBe(6);
  });

  it('should return true if there is enough stock', () => {
    const product = createMockProduct(5);
    expect(product.hasEnoughStock(5)).toBe(true);
    expect(product.hasEnoughStock(1)).toBe(true);
  });

  it('should return false if there is NOT enough stock', () => {
    const product = createMockProduct(5);
    expect(product.hasEnoughStock(6)).toBe(false);
  });

  it('should throw an error when decreasing more than available stock', () => {
    const product = createMockProduct(2);
    expect(() => product.decreaseStock(3)).toThrow('Insufficient stock');
  });
});