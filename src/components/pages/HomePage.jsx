import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import QuickStatsSection from '@/components/organisms/QuickStatsSection';
import QuickActionsSection from '@/components/organisms/QuickActionsSection';
import FeaturesOverviewSection from '@/components/organisms/FeaturesOverviewSection';
import { productService, alertService } from '@/services'; // Ensure paths are correct

function HomePage() {
  const [quickStats, setQuickStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    activeAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      const [products, alerts] = await Promise.all([
        productService.getAll(),
        alertService.getAll()
      ]);

      const totalValue = products.reduce((sum, product) =>
        sum + (product.currentStock * product.salePrice), 0
      );

      const lowStockItems = products.filter(product =>
        product.currentStock <= product.minStock
      ).length;

      const activeAlerts = alerts.filter(alert =>
        alert.triggered && !alert.acknowledgedAt
      ).length;

      setQuickStats({
        totalProducts: products.length,
        totalValue,
        lowStockItems,
        activeAlerts
      });
    } catch (err) {
      console.error('Failed to load quick stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-surface-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="Package" className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-heading font-bold text-gray-900">StockFlow Pro</h1>
          </div>
          <p className="text-xl text-surface-600 max-w-2xl mx-auto">
            Comprehensive inventory management system to streamline your stock control and prevent costly stockouts
          </p>
        </motion.div>

        {/* Quick Stats */}
        <QuickStatsSection quickStats={quickStats} loading={loading} />

        {/* Quick Actions */}
        <QuickActionsSection quickStats={quickStats} />

        {/* Features Overview */}
        <FeaturesOverviewSection />
      </div>
    </div>
  );
}

export default HomePage;