import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import { productService, stockMovementService, alertService } from '../services';

function Dashboard() {
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
      const activeAlerts = alerts.filter(alert => alert.triggered);
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
        {/* Metrics skeleton */}
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
        
        {/* Content skeleton */}
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
      <div className="p-6 flex items-center justify-center min-h-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Dashboard</h3>
          <p className="text-surface-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-surface-500">Overview of your inventory status</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadDashboardData}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200"
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" className="text-accent" size={20} />
              </div>
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-surface-500 truncate">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${metrics.totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="text-warning" size={20} />
              </div>
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-surface-500 truncate">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.lowStockItems}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="ArrowUpDown" className="text-info" size={20} />
              </div>
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-surface-500 truncate">Today's Movements</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.todayMovements}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Package" className="text-primary" size={20} />
              </div>
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-surface-500 truncate">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalProducts}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Feature */}
      <MainFeature 
        recentMovements={recentMovements}
        lowStockAlerts={lowStockAlerts}
        onRefresh={loadDashboardData}
      />
    </div>
  );
}

export default Dashboard;