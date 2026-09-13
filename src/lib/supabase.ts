import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'archived';
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductInput = {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'archived';
  description: string | null;
};

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food',
  'Books',
  'Home',
  'Sports',
  'Other',
] as const;

export const STATUSES = ['active', 'archived'] as const;
