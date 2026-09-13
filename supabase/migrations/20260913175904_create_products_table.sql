/*
# Create products table (single-tenant, no auth)

## Overview
Creates a `products` table for an inventory management dashboard. This is a single-tenant app with no sign-in screen, so all policies allow anon + authenticated access to the shared product data.

## New Tables
- `products`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — product name
  - `sku` (text, not null, unique) — stock keeping unit
  - `category` (text, not null) — product category (Electronics, Clothing, Food, Books, Other)
  - `price` (numeric, not null, default 0) — unit price in USD
  - `stock` (integer, not null, default 0) — quantity in stock
  - `status` (text, not null, default 'active') — 'active' or 'archived'
  - `description` (text, nullable) — optional product description
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

## Indexes
- Index on `category` for filtering by category
- Index on `status` for filtering by status
- Index on `created_at` for sorting by newest

## Security
- Enable RLS on `products`.
- Allow anon + authenticated full CRUD because the data is intentionally shared/public (no-auth single-tenant app).
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Other',
  price numeric(10,2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();