import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ProductTableRow from '@/components/molecules/ProductTableRow';
import SkeletonRow from '@/components/atoms/SkeletonRow';

const ProductsTable = ({ products, onAdjustStock, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden p-6">
                <SkeletonRow count={5} />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-surface-200">
                    <thead className="bg-surface-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Stock Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-surface-200">
                        <AnimatePresence>
                            {products.map((product, index) => (
                                <ProductTableRow
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    onAdjustStock={onAdjustStock}
                                />
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsTable;