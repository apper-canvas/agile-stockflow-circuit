import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';

const QuickStatsSection = ({ quickStats, loading }) => {
    if (loading) {
        return null; // Or show skeleton if desired, but original just hid it
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
            <StatCard
                value={quickStats.totalProducts}
                label="Total Products"
                delay={0.1}
            />
            <StatCard
                value={`$${quickStats.totalValue.toLocaleString()}`}
                label="Total Value"
                delay={0.2}
            />
            <StatCard
                value={quickStats.lowStockItems}
                label="Low Stock Items"
                valueClassName={quickStats.lowStockItems > 0 ? 'text-warning' : 'text-gray-900'}
                delay={0.3}
            />
            <StatCard
                value={quickStats.activeAlerts}
                label="Active Alerts"
                valueClassName={quickStats.activeAlerts > 0 ? 'text-error' : 'text-gray-900'}
                delay={0.4}
            />
        </motion.div>
    );
};

export default QuickStatsSection;