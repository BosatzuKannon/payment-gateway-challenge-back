export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    private _stockQuantity: number,
    public readonly imageUrl: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

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