/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { IProductRepository } from '../domain/product.repository';
import { Product } from '../domain/product.entity';

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class SupabaseProductRepository implements IProductRepository {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || '',
    );
  }

  async findAll(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }

    const rows = data as ProductRow[];

    return rows.map(
      (item) =>
        new Product(
          item.id,
          item.name,
          item.description,
          item.price,
          item.stock_quantity,
          item.image_url,
          new Date(item.created_at),
          new Date(item.updated_at),
        ),
    );
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    const row = data as ProductRow;

    return new Product(
      row.id,
      row.name,
      row.description,
      row.price,
      row.stock_quantity,
      row.image_url,
      new Date(row.created_at),
      new Date(row.updated_at),
    );
  }

  async update(product: Product): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .update({ stock_quantity: product.stockQuantity })
      .eq('id', product.id);

    if (error) {
      throw new Error(`Error updating product stock: ${error.message}`);
    }
  }
}
