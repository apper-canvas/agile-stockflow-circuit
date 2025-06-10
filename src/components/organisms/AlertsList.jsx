import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlertListItem from '@/components/molecules/AlertListItem';
import SkeletonRow from '@/components/atoms/SkeletonRow';

const AlertsList = ({ alerts, products, acknowledgeAlert, isLoading = false }) => {
    if (isLoading) {
        return <SkeletonRow count={5} className="p-6" />;
    }

    const getProduct = (productId) => {
        return products.find(p => p.id === productId);
    };

    const getPriorityLevel = (alert) => {
        if (alert.type === 'out_of_stock') return 'critical';
        if (alert.type === 'low_stock' && alert.currentLevel === 0) return 'critical';
        if (alert.type === 'low_stock') return 'high';
        return 'medium';
    };

    const sortedAlerts = [...alerts].sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2 };
        const aPriority = getPriorityLevel(a);
        const bPriority = getPriorityLevel(b);

        if (aPriority !== bPriority) {
            return priorityOrder[aPriority] - priorityOrder[bPriority];
        }

        return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
    });

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {sortedAlerts.map((alert, index) => {
                    const product = getProduct(alert.productId);
                    const priority = getPriorityLevel(alert);

                    if (!product) return null;

                    return (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-white rounded-lg border-l-4 shadow-sm border border-surface-200 p-6 hover:shadow-md transition-shadow duration-200 ${
                                priority === 'critical' ? 'border-l-error' :
                                priority === 'high' ? 'border-l-warning' : 'border-l-info'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 min-w-0 flex-1">
                                    <div className={`p-2 rounded-lg ${
                                        alert.type === 'low_stock' ? 'bg-warning/10 text-warning' :
                                        alert.type === 'out_of_stock' ? 'bg-error/10 text-error' :
                                        alert.type === 'high_stock' ? 'bg-info/10 text-info' : 'bg-surface-100 text-surface-600'
                                    }`}>
                                        <ApperIcon name={
                                            alert.type === 'low_stock' ? 'AlertTriangle' :
                                            alert.type === 'out_of_stock' ? 'XCircle' :
                                            alert.type === 'high_stock' ? 'TrendingUp' : 'Bell'
                                        } size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-lg font-medium text-gray-900 break-words">
                                                {product.name}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                priority === 'critical' ? 'bg-error/10 text-error' :
                                                priority === 'high' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'
                                            }`}>
                                                {priority.toUpperCase()}
                                            </span>
                                            {alert.acknowledgedAt && (
                                                <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                                                    ACKNOWLEDGED
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-surface-600 break-words mb-2">
                                            SKU: {product.sku} • Category: {product.category}
                                        </p>

                                        <div className="flex items-center space-x-4 text-sm">
                                            <div>
                                                <span className="text-surface-500">Current Stock:</span>
                                                <span className={`ml-1 font-medium ${
                                                    alert.currentLevel === 0 ? 'text-error' :
                                                    alert.currentLevel <= alert.threshold ? 'text-warning' : 'text-gray-900'
                                                }`}>
                                                    {alert.currentLevel} {product.unit}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-surface-500">Threshold:</span>
                                                <span className="ml-1 font-medium text-gray-900">
                                                    {alert.threshold} {product.unit}
                                                </span>
                                            </div>
                                        </div>

                                        {alert.acknowledgedAt && (
                                            <p className="text-xs text-surface-400 mt-2">
                                                Acknowledged on {format(new Date(alert.acknowledgedAt), 'MMM dd, yyyy h:mm a')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {!alert.acknowledgedAt && (
                                    <div className="flex space-x-2 ml-4">
                                        <MotionButton
                                            onClick={() => acknowledgeAlert(alert.id)}
                                            className="px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white"
                                        >
                                            Acknowledge
                                        </MotionButton>
                                    </div>
                                )}
                            </div>

                            {/* Stock Level Indicator */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-surface-500 mb-1">
                                    <span>Stock Level</span>
                                    <span>{((alert.currentLevel / product.maxStock) * 100).toFixed(0)}% of max</span>
                                </div>
                                <div className="w-full bg-surface-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            alert.currentLevel === 0 ? 'bg-error' :
                                            alert.currentLevel <= alert.threshold ? 'bg-warning' : 'bg-success'
                                        }`}
                                        style={{
                                            width: `${Math.min(100, (alert.currentLevel / product.maxStock) * 100)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default AlertsList;