import { useEffect, useState } from 'react';
import { X, Package, AlertCircle } from 'lucide-react';
import { Product, ProductInput, CATEGORIES } from '@/lib/supabase';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductInput, id?: string) => Promise<void>;
  product: Product | null;
}

const emptyForm: ProductInput = {
  name: '',
  sku: '',
  category: 'Electronics',
  price: 0,
  stock: 0,
  status: 'active',
  description: '',
};

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stock: product.stock,
        status: product.status,
        description: product.description ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setSubmitError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.sku.trim()) errs.sku = 'SKU is required';
    if (form.price < 0) errs.price = 'Price must be 0 or greater';
    if (form.stock < 0) errs.stock = 'Stock must be 0 or greater';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSubmitError(null);
    try {
      await onSave(
        {
          ...form,
          name: form.name.trim(),
          sku: form.sku.trim().toUpperCase(),
          description: form.description?.trim() || null,
        },
        product?.id,
      );
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-slate-500">
                {product ? 'Update product information' : 'Fill in the details below'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {submitError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="e.g. Wireless Headphones"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 uppercase ${
                  errors.sku
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="e.g. WH-001"
              />
              {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                  errors.price
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                  errors.stock
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={form.status === 'active'}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as 'active' | 'archived' })
                    }
                    className="peer sr-only"
                  />
                  <div className="px-4 py-2.5 rounded-lg border border-slate-200 text-center text-sm font-medium text-slate-600 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 transition-colors">
                    Active
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="archived"
                    checked={form.status === 'archived'}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as 'active' | 'archived' })
                    }
                    className="peer sr-only"
                  />
                  <div className="px-4 py-2.5 rounded-lg border border-slate-200 text-center text-sm font-medium text-slate-600 peer-checked:border-slate-400 peer-checked:bg-slate-100 peer-checked:text-slate-700 transition-colors">
                    Archived
                  </div>
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors resize-none"
                placeholder="Optional product description..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
