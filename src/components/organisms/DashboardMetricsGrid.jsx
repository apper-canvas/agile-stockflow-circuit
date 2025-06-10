import React from 'react';
import MetricCard from '@/components/molecules/MetricCard';
import { motion } from 'framer-motion';

const DashboardMetricsGrid = ({ metrics, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-lg p-6 shadow-sm animate-pulse"
                    >
                        <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-surface-200 rounded w-3/4"></div>
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
                iconName="DollarSign"
                iconColor="text-accent"
                bgColor="bg-accent/10"
                label="Total Stock Value"
                value={`$${metrics.totalValue.toLocaleString()}`}
                delay={0.1}
            />
            <MetricCard
                iconName="AlertTriangle"
                iconColor="text-warning"
                bgColor="bg-warning/10"
                label="Low Stock Items"
                value={metrics.lowStockItems}
                delay={0.2}
            />
            <MetricCard
                iconName="ArrowUpDown"
                iconColor="text-info"
                bgColor="bg-info/10"
                label="Today's Movements"
                value={metrics.todayMovements}
                delay={0.3}
            />
            <MetricCard
                iconName="Package"
                iconColor="text-primary"
                bgColor="bg-primary/10"
                label="Total Products"
                value={metrics.totalProducts}
                delay={0.4}
            />
        </div>
    );
};

export default DashboardMetricsGrid;