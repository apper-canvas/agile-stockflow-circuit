import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '@/components/organisms/PageHeader';
import ProductFilterSection from '@/components/organisms/ProductFilterSection';
import ProductsTable from '@/components/organisms/ProductsTable';
import StockAdjustmentModal from '@/components/organisms/StockAdjustmentModal';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import { productService, stockMovementService } from '@/services'; // Ensure paths are correct

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [adjustmentModal, setAdjustmentModal] = useState({ open: false, product: null });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await productService.getAll();
      setProducts(result);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product) => {
    if (product.currentStock <= product.minStock) return 'low';
    if (product.currentStock >= product.maxStock) return 'high';
    return 'normal';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter || product.category === categoryFilter;

    const matchesStock = !stockFilter ||
      (stockFilter === 'low' && product.currentStock <= product.minStock) ||
      (stockFilter === 'normal' && product.currentStock > product.minStock && product.currentStock < product.maxStock) ||
      (stockFilter === 'high' && product.currentStock >= product.maxStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-surface-200 rounded w-full mb-6"></div>
        </div>
        <ProductsTable isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Products"
        message={error}
        onRetry={loadProducts}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        iconName="Package"
        title="No Products Found"
        message="Add your first product to start managing inventory"
        actionButtonText="Add Product"
        onActionButtonClick={() => toast.info('Add Product functionality not yet implemented!')} // Placeholder
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <PageHeader
        title="Products"
        description="Manage your inventory items"
      />

      <ProductFilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
        categories={categories}
      />

      <ProductsTable
        products={filteredProducts}
        onAdjustStock={(product) => setAdjustmentModal({ open: true, product })}
      />

      {filteredProducts.length === 0 && searchTerm && (
        <EmptyState
          iconName="Search"
          title="No products found"
          message="Try adjusting your search or filter criteria"
          animateIcon={false}
        />
      )}

      <StockAdjustmentModal
        isOpen={adjustmentModal.open}
        onClose={() => setAdjustmentModal({ open: false, product: null })}
        product={adjustmentModal.product}
        onProductAdjusted={loadProducts}
      />
    </div>
  );
}

export default ProductsPage;