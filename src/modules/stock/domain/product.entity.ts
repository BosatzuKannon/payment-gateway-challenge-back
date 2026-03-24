import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  public readonly id: string;

  @ApiProperty({ example: 'Monitor Ultrawide 34"' })
  public readonly name: string;

  @ApiProperty({ example: 'High resolution monitor for productivity' })
  public readonly description: string;

  @ApiProperty({ example: 1200000 })
  public readonly price: number;

  @ApiProperty({ example: 15 })
  private _stockQuantity: number;

  @ApiProperty({ example: 'https://image-url.com/monitor.jpg' })
  public readonly imageUrl: string;

  @ApiProperty({ example: '2026-03-24T00:00:00Z' })
  public readonly createdAt: Date;

  @ApiProperty({ example: '2026-03-24T00:00:00Z' })
  public readonly updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    stockQuantity: number,
    imageUrl: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this._stockQuantity = stockQuantity;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get stockQuantity(): number {
    return this._stockQuantity;
  }

  hasEnoughStock(quantity: number): boolean {
    return this._stockQuantity >= quantity;
  }

  decreaseStock(quantity: number): void {
    if (!this.hasEnoughStock(quantity)) {
      throw new Error('Insufficient stock');
    }
    this._stockQuantity -= quantity;
  }
}