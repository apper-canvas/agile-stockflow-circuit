import React from 'react';
import { AnimatePresence } from 'framer-motion';
import MovementTableRow from '@/components/molecules/MovementTableRow';
import SkeletonRow from '@/components/atoms/SkeletonRow';

const StockMovementsTable = ({ movements, getProductName, getProductSku, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden p-6">
                <SkeletonRow count={8} />
            </div>
        );
    }

    const sortedMovements = [...movements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-surface-200">
                    <thead className="bg-surface-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-surface-200">
                        {sortedMovements.map((movement, index) => (
                            <MovementTableRow
                                key={movement.id}
                                movement={movement}
                                productName={getProductName(movement.productId)}
                                productSku={getProductSku(movement.productId)}
                                index={index}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockMovementsTable;