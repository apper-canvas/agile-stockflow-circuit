import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '@/components/organisms/PageHeader';
import DashboardMetricsGrid from '@/components/organisms/DashboardMetricsGrid';
import RecentStockMovementsList from '@/components/organisms/RecentStockMovementsList';
import LowStockAlertsSummary from '@/components/organisms/LowStockAlertsSummary';
import ErrorState from '@/components/organisms/ErrorState';
import { productService, stockMovementService, alertService } from '@/services'; // Ensure paths are correct

function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalValue: 0,
    lowStockItems: 0,
    todayMovements: 0,
    totalProducts: 0
  });
  const [recentMovements, setRecentMovements] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [products, movements, alerts] = await Promise.all([
        productService.getAll(),
        stockMovementService.getAll(),
        alertService.getAll()
      ]);

      // Calculate metrics
      const totalValue = products.reduce((sum, product) =>
        sum + (product.currentStock * product.salePrice), 0
      );

      const lowStockItems = products.filter(product =>
        product.currentStock <= product.minStock
      ).length;

      const today = new Date().toDateString();
      const todayMovements = movements.filter(movement =>
        new Date(movement.timestamp).toDateString() === today
      ).length;

      setMetrics({
        totalValue,
        lowStockItems,
        todayMovements,
        totalProducts: products.length
      });

      // Get recent movements (last 5)
      const sortedMovements = movements
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
      setRecentMovements(sortedMovements);

      // Get active low stock alerts
      const activeAlerts = alerts.filter(alert => alert.triggered && !alert.acknowledgedAt);
      setLowStockAlerts(activeAlerts);

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <DashboardMetricsGrid isLoading={true} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-surface-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-surface-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Dashboard"
        message={error}
        onRetry={loadDashboardData}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <PageHeader
        title="Dashboard"
        description="Overview of your inventory status"
        onRefresh={loadDashboardData}
      />

      <DashboardMetricsGrid metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentStockMovementsList recentMovements={recentMovements} />
        <LowStockAlertsSummary lowStockAlerts={lowStockAlerts} />
      </div>
    </div>
  );
}

export default DashboardPage;