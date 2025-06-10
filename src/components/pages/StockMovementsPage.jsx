import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '@/components/organisms/PageHeader';
import StockMovementFilterSection from '@/components/organisms/StockMovementFilterSection';
import StockMovementsTable from '@/components/organisms/StockMovementsTable';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import { stockMovementService, productService } from '@/services'; // Ensure paths are correct

function StockMovementsPage() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [reasonFilter, setReasonFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [movementsResult, productsResult] = await Promise.all([
        stockMovementService.getAll(),
        productService.getAll()
      ]);

      setMovements(movementsResult);
      setProducts(productsResult);
    } catch (err) {
      setError(err.message || 'Failed to load stock movements');
      toast.error('Failed to load stock movements');
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getProductSku = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.sku : 'N/A';
  };

  const filteredMovements = movements.filter(movement => {
    const productName = getProductName(movement.productId);
    const productSku = getProductSku(movement.productId);

    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !typeFilter || movement.type === typeFilter;
    const matchesReason = !reasonFilter || movement.reason === reasonFilter;

    return matchesSearch && matchesType && matchesReason;
  });

  const reasons = [...new Set(movements.map(m => m.reason))];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-surface-200 rounded w-full mb-6"></div>
        </div>
        <StockMovementsTable isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Stock Movements"
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (movements.length === 0) {
    return (
      <EmptyState
        iconName="ArrowUpDown"
        title="No Stock Movements"
        message="Stock movements will appear here as you adjust inventory"
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <PageHeader
        title="Stock Movements"
        description="Track all inventory transactions"
        onRefresh={loadData}
      />

      <StockMovementFilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        reasonFilter={reasonFilter}
        onReasonFilterChange={setReasonFilter}
        reasons={reasons}
      />

      <StockMovementsTable
        movements={filteredMovements}
        getProductName={getProductName}
        getProductSku={getProductSku}
      />

      {filteredMovements.length === 0 && searchTerm && (
        <EmptyState
          iconName="Search"
          title="No movements found"
          message="Try adjusting your search or filter criteria"
          animateIcon={false}
        />
      )}
    </div>
  );
}

export default StockMovementsPage;