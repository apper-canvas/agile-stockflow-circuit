import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '@/components/organisms/PageHeader';
import SupplierFilterSection from '@/components/organisms/SupplierFilterSection';
import SuppliersGrid from '@/components/organisms/SuppliersGrid';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import { supplierService, productService } from '@/services'; // Ensure paths are correct

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [suppliersResult, productsResult] = await Promise.all([
        supplierService.getAll(),
        productService.getAll()
      ]);

      setSuppliers(suppliersResult);
      setProducts(productsResult);
    } catch (err) {
      setError(err.message || 'Failed to load suppliers');
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-surface-200 rounded w-full mb-6"></div>
        </div>
        <SuppliersGrid isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Suppliers"
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (suppliers.length === 0) {
    return (
      <EmptyState
        iconName="Truck"
        title="No Suppliers Found"
        message="Add suppliers to manage your product sourcing"
        actionButtonText="Add Supplier"
        onActionButtonClick={() => toast.info('Add Supplier functionality not yet implemented!')} // Placeholder
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <PageHeader
        title="Suppliers"
        description="Manage your supplier relationships"
        onRefresh={loadData}
      />

      <SupplierFilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <SuppliersGrid
        suppliers={filteredSuppliers}
        products={products}
      />

      {filteredSuppliers.length === 0 && searchTerm && (
        <EmptyState
          iconName="Search"
          title="No suppliers found"
          message="Try adjusting your search criteria"
          animateIcon={false}
        />
      )}
    </div>
  );
}

export default SuppliersPage;