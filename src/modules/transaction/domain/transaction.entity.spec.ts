import { Transaction } from './transaction.entity';

describe('Transaction Entity', () => {
  it('should create a transaction instance correctly', () => {
    const date = new Date();
    const tx = new Transaction(
      '1', 'p1', 1, 5000, 'completed', date, 'w1', 'C', 'c@e.com', 'A', 'City', '52'
    );

    expect(tx.id).toBe('1');
    expect(tx.createdAt).toBe(date);
    expect(tx.status).toBe('completed');
  });
});