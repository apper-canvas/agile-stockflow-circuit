import React from 'react';
import SupplierCard from '@/components/molecules/SupplierCard';
import SkeletonCard from '@/components/atoms/SkeletonCard';

const SuppliersGrid = ({ suppliers, products, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonCard count={6} className="h-64" />
            </div>
        );
    }

    const getSupplierProducts = (supplierId) => {
        return products.filter(product => product.supplierId === supplierId);
    };

    const getSupplierMetrics = (supplierId) => {
        const supplierProducts = getSupplierProducts(supplierId);
        const totalProducts = supplierProducts.length;
        const totalValue = supplierProducts.reduce((sum, product) =>
            sum + (product.currentStock * product.salePrice), 0
        );
        const lowStockProducts = supplierProducts.filter(product =>
            product.currentStock <= product.minStock
        ).length;

        return { totalProducts, totalValue, lowStockProducts };
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier, index) => {
                const metrics = getSupplierMetrics(supplier.id);
                const supplierProducts = getSupplierProducts(supplier.id);

                return (
                    <SupplierCard
                        key={supplier.id}
                        supplier={supplier}
                        productsForSupplier={supplierProducts}
                        metrics={metrics}
                        index={index}
                    />
                );
            })}
        </div>
    );
};

export default SuppliersGrid;