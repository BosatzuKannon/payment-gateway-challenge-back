export type TransactionStatus = 'pending' | 'completed' | 'failed';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly totalAmount: number,
    private _status: TransactionStatus,
    public readonly createdAt: Date,
  ) {}

  get status(): TransactionStatus {
    return this._status;
  }

  markAsCompleted(): void {
    if (this._status !== 'pending') {
      throw new Error(
        'Solo las transacciones pendientes pueden ser completadas',
      );
    }
    this._status = 'completed';
  }

  markAsFailed(): void {
    if (this._status !== 'pending') {
      throw new Error(
        'Solo las transacciones pendientes pueden ser marcadas como fallidas',
      );
    }
    this._status = 'failed';
  }
}
