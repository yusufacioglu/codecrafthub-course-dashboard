export type SortField = 'name' | 'sku' | 'category' | 'price' | 'stock' | 'status' | 'created_at';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  search: string;
  category: string;
  status: string;
}
