import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Package,
  AlertCircle,
} from 'lucide-react';
import { Product } from '@/lib/supabase';
import { SortConfig, SortField } from '@/types';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-slate-100 text-slate-500 border-slate-200',
};

const categoryStyles: Record<string, string> = {
  Electronics: 'bg-blue-50 text-blue-700 border-blue-200',
  Clothing: 'bg-purple-50 text-purple-700 border-purple-200',
  Food: 'bg-amber-50 text-amber-700 border-amber-200',
  Books: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Home: 'bg-teal-50 text-teal-700 border-teal-200',
  Sports: 'bg-orange-50 text-orange-700 border-orange-200',
  Other: 'bg-slate-50 text-slate-600 border-slate-200',
};

function getStockBadge(stock: number) {
  if (stock === 0)
    return { label: 'Out of stock', className: 'bg-red-50 text-red-600 border-red-200' };
  if (stock < 10)
    return { label: 'Low stock', className: 'bg-amber-50 text-amber-600 border-amber-200' };
  return { label: 'In stock', className: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
}

export default function ProductTable({
  products,
  loading,
  error,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-red-600">{error}</p>
          <p className="text-xs text-slate-400">Try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 text-slate-300">
            <Package className="w-8 h-8" />
          </div>
          <p className="text-base font-medium text-slate-600">No products found</p>
          <p className="text-sm text-slate-400">
            Try adjusting your filters or add a new product to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-5 py-3.5">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  Product {getSortIcon('name')}
                </button>
              </th>
              <th className="text-left px-5 py-3.5">
                <button
                  onClick={() => onSort('sku')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  SKU {getSortIcon('sku')}
                </button>
              </th>
              <th className="text-left px-5 py-3.5">
                <button
                  onClick={() => onSort('category')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  Category {getSortIcon('category')}
                </button>
              </th>
              <th className="text-right px-5 py-3.5">
                <button
                  onClick={() => onSort('price')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors ml-auto"
                >
                  Price {getSortIcon('price')}
                </button>
              </th>
              <th className="text-right px-5 py-3.5">
                <button
                  onClick={() => onSort('stock')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors ml-auto"
                >
                  Stock {getSortIcon('stock')}
                </button>
              </th>
              <th className="text-center px-5 py-3.5">
                <button
                  onClick={() => onSort('status')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors mx-auto"
                >
                  Status {getSortIcon('status')}
                </button>
              </th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((product) => {
              const stockBadge = getStockBadge(product.stock);
              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-400 shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                          {product.name}
                        </p>
                        {product.description && (
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono text-slate-600">{product.sku}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${
                        categoryStyles[product.category] ?? categoryStyles.Other
                      }`}
                    >
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-slate-900">{product.stock}</span>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${stockBadge.className}`}
                      >
                        {stockBadge.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${
                        statusStyles[product.status]
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 mt-0.5 ${
                          product.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {product.status === 'active' ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
