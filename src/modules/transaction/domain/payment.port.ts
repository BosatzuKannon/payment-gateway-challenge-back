import { Result } from '../application/result';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const IPaymentPort = Symbol('IPaymentPort');

export interface IPaymentPort {
  charge(token: string, amountInCents: number, reference: string, customerEmail: string): Promise<Result<string>>;
}

