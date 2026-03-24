/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ITransactionRepository } from '../domain/transaction.repository';
import { Transaction } from '../domain/transaction.entity';

@Injectable()
export class SupabaseTransactionRepository implements ITransactionRepository {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || '',
    );
  }

  async create(transaction: Transaction): Promise<void> {
  const { error } = await this.supabase.from('transactions').insert([
    {
      id: transaction.id,
      product_id: transaction.productId,
      quantity: transaction.quantity,
      total_amount: transaction.totalAmount,
      status: transaction.status,
      created_at: transaction.createdAt.toISOString(),
      wompi_id: transaction.wompiId,
      customer_name: transaction.customerName,
      customer_email: transaction.customerEmail,
      shipping_address: transaction.shippingAddress,
      shipping_city: transaction.shippingCity,
      shipping_zip_code: transaction.shippingZipCode,
    },
  ]);

  if (error) {
    throw new Error(`Error saving transaction: ${error.message}`);
  }
}
}
