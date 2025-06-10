import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import MotionButton from '@/components/molecules/MotionButton';

const ProductTableRow = ({ product, index, onAdjustStock }) => {
    const getStockStatus = (prod) => {
        if (prod.currentStock <= prod.minStock) return 'low';
        if (prod.currentStock >= prod.maxStock) return 'high';
        return 'normal';
    };

    const getStockColor = (status) => {
        switch (status) {
            case 'low': return 'bg-error';
            case 'high': return 'bg-warning';
            default: return 'bg-success';
        }
    };

    const stockStatus = getStockStatus(product);
    const stockPercentage = Math.min(100, (product.currentStock / product.maxStock) * 100);

    return (
        <motion.tr
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className="hover:bg-surface-50 transition-colors duration-200"
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 break-words">{product.name}</div>
                <div className="text-sm text-surface-500 break-words">{product.description}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-surface-100 text-surface-700 rounded-full">
                    {product.category}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                            {product.currentStock} {product.unit}
                        </div>
                        <div className="w-full bg-surface-200 rounded-full h-2 mt-1">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${getStockColor(stockStatus)}`}
                                style={{ width: `${stockPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                    {stockStatus === 'low' && (
                        <ApperIcon name="AlertTriangle" className="text-warning" size={16} />
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${(product.currentStock * product.salePrice).toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <MotionButton
                    onClick={() => onAdjustStock(product)}
                    className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                    Adjust Stock
                </MotionButton>
            </td>
        </motion.tr>
    );
};

export default ProductTableRow;