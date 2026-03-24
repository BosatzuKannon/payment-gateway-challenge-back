import { ApiProperty } from '@nestjs/swagger';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export class Transaction {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  public readonly id: string;

  @ApiProperty({ example: 'prod-uuid-123' })
  public readonly productId: string;

  @ApiProperty({ example: 2 })
  public readonly quantity: number;

  @ApiProperty({ example: 1200000 })
  public readonly totalAmount: number;

  @ApiProperty({
    example: 'completed',
    enum: ['pending', 'completed', 'failed'],
  })
  private _status: TransactionStatus;

  @ApiProperty({ example: '2026-03-24T00:00:00Z' })
  public readonly createdAt: Date;

  @ApiProperty({ example: 'wompi_tx_888' })
  public readonly wompiId: string;

  @ApiProperty({ example: 'Carlos Jaramillo' })
  public readonly customerName: string;

  @ApiProperty({ example: 'carlos@test.com' })
  public readonly customerEmail: string;

  @ApiProperty({ example: 'Calle 123 #45-67' })
  public readonly shippingAddress: string;

  @ApiProperty({ example: 'Pasto' })
  public readonly shippingCity: string;

  @ApiProperty({ example: '520001', required: false })
  public readonly shippingZipCode?: string;

  constructor(
    id: string,
    productId: string,
    quantity: number,
    totalAmount: number,
    status: TransactionStatus,
    createdAt: Date,
    wompiId: string,
    customerName: string,
    customerEmail: string,
    shippingAddress: string,
    shippingCity: string,
    shippingZipCode?: string,
  ) {
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
    this.totalAmount = totalAmount;
    this._status = status;
    this.createdAt = createdAt;
    this.wompiId = wompiId;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.shippingAddress = shippingAddress;
    this.shippingCity = shippingCity;
    this.shippingZipCode = shippingZipCode;
  }

  @ApiProperty({ example: 'completed' })
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
