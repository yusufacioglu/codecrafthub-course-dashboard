import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Package2,
  DollarSign,
  Boxes,
  Archive,
  RefreshCw,
  X,
  LayoutGrid,
  ChevronDown,
} from 'lucide-react';
import { supabase, Product, ProductInput, CATEGORIES } from '@/lib/supabase';
import { SortConfig, SortField, FilterConfig } from '@/types';
import StatCard from '@/components/StatCard';
import ProductTable from '@/components/ProductTable';
import ProductModal from '@/components/ProductModal';
import DeleteDialog from '@/components/DeleteDialog';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'created_at',
    direction: 'desc',
  });
  const [filters, setFilters] = useState<FilterConfig>({
    search: '',
    category: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order(sortConfig.field, { ascending: sortConfig.direction === 'asc' });
    if (fetchError) {
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } else {
      setProducts(data ?? []);
    }
    setLoading(false);
  }, [sortConfig]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleSave = async (data: ProductInput, id?: string) => {
    if (id) {
      const { error: updateError } = await supabase.from('products').update(data).eq('id', id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase.from('products').insert(data);
      if (insertError) throw insertError;
    }
    await fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteTarget.id);
    if (deleteError) {
      setError('Failed to delete product. Please try again.');
    } else {
      setDeleteTarget(null);
      await fetchProducts();
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false);
        if (!matches) return false;
      }
      if (filters.category && p.category !== filters.category) return false;
      if (filters.status && p.status !== filters.status) return false;
      return true;
    });
  }, [products, filters]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === 'active').length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const archivedCount = products.filter((p) => p.status === 'archived').length;
    return { totalProducts, activeProducts, totalValue, lowStock, outOfStock, archivedCount };
  }, [products]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.status) count++;
    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters({ search: '', category: '', status: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200/50">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Inventory Hub</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Product Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Products"
            value={stats.totalProducts.toString()}
            icon={Package2}
            color="blue"
            sublabel={`${stats.activeProducts} active`}
          />
          <StatCard
            label="Inventory Value"
            value={`$${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            icon={DollarSign}
            color="emerald"
            sublabel="Total stock value"
          />
          <StatCard
            label="Low Stock Items"
            value={stats.lowStock.toString()}
            icon={Boxes}
            color="amber"
            sublabel={`${stats.outOfStock} out of stock`}
          />
          <StatCard
            label="Archived"
            value={stats.archivedCount.toString()}
            icon={Archive}
            color="rose"
            sublabel="Inactive products"
          />
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by name, SKU, or description..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors text-sm"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="flex flex-wrap items-end gap-3 pt-3 border-t border-slate-100">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors text-sm min-w-[140px]"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors text-sm min-w-[140px]"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredProducts.length}</span>{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'}
            {filters.search || activeFilterCount > 0 ? ' (filtered)' : ''}
          </p>
        </div>

        {/* Table */}
        <ProductTable
          products={filteredProducts}
          loading={loading}
          error={error}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={openEditModal}
          onDelete={(product) => setDeleteTarget(product)}
        />
      </main>

      {/* Modals */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
      />
      <DeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        productName={deleteTarget?.name ?? ''}
      />
    </div>
  );
}
