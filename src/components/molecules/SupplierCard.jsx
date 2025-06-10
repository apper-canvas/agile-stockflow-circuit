import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import MotionButton from '@/components/molecules/MotionButton';

const SupplierCard = ({ supplier, productsForSupplier, metrics, index }) => {
    return (
        <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
            {/* Supplier Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Truck" className="text-primary" size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 break-words">{supplier.name}</h3>
                        <p className="text-sm text-surface-500 break-words">{supplier.contactName}</p>
                    </div>
                </div>
                {metrics.lowStockProducts > 0 && (
                    <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                        {metrics.lowStockProducts} Low Stock
                    </span>
                )}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-surface-600">
                    <ApperIcon name="Mail" size={14} />
                    <span className="break-words">{supplier.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-surface-600">
                    <ApperIcon name="Phone" size={14} />
                    <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-surface-600">
                    <ApperIcon name="MapPin" size={14} />
                    <span className="break-words">{supplier.address}</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{metrics.totalProducts}</div>
                    <div className="text-xs text-surface-500">Products</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                        ${metrics.totalValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-surface-500">Value</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{supplier.leadTime}</div>
                    <div className="text-xs text-surface-500">Days Lead</div>
                </div>
            </div>

            {/* Products List */}
            {productsForSupplier.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Products ({productsForSupplier.length})</h4>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                        {productsForSupplier.slice(0, 3).map((product) => (
                            <div key={product.id} className="flex items-center justify-between text-xs">
                                <span className="text-surface-600 truncate">{product.name}</span>
                                <span className={`font-medium ${
                                    product.currentStock <= product.minStock ? 'text-warning' : 'text-surface-500'
                                }`}>
                                    {product.currentStock} {product.unit}
                                </span>
                            </div>
                        ))}
                        {productsForSupplier.length > 3 && (
                            <div className="text-xs text-surface-400">
                                +{productsForSupplier.length - 3} more
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-surface-200">
                <MotionButton
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-3 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white"
                >
                    View Details
                </MotionButton>
            </div>
        </motion.div>
    );
};

export default SupplierCard;