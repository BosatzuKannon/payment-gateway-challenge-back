import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IProductRepository } from '../domain/product.repository';
import { Product } from '../domain/product.entity';

@Injectable()
export class SupabaseProductRepository implements IProductRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || ''
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

    return data.map(
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

    return new Product(
      data.id,
      data.name,
      data.description,
      data.price,
      data.stock_quantity,
      data.image_url,
      new Date(data.created_at),
      new Date(data.updated_at),
    );
  }

  async update(product: Product): Promise<void> {
    return;
  }
}