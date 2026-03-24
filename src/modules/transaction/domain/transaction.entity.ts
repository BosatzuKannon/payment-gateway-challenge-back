export type TransactionStatus = 'pending' | 'completed' | 'failed';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly totalAmount: number,
    private _status: TransactionStatus,
    public readonly createdAt: Date,
    public readonly wompiId: string,
    public readonly customerName: string,
    public readonly customerEmail: string,
    public readonly shippingAddress: string,
    public readonly shippingCity: string,
    public readonly shippingZipCode?: string,
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
