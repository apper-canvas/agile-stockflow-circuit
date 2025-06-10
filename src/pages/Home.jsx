import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import { productService, alertService } from '../services';

function Home() {
  const navigate = useNavigate();
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

  const quickActions = [
    {
      title: 'View Dashboard',
      description: 'See comprehensive inventory overview',
      icon: 'LayoutDashboard',
      path: '/dashboard',
      color: 'bg-primary text-white'
    },
    {
      title: 'Manage Products',
      description: 'Add, edit, and adjust stock levels',
      icon: 'Package',
      path: '/products',
      color: 'bg-accent text-white'
    },
    {
      title: 'Check Alerts',
      description: 'Review low stock warnings',
      icon: 'AlertTriangle',
      path: '/alerts',
      color: 'bg-warning text-white',
      badge: quickStats.activeAlerts > 0 ? quickStats.activeAlerts : null
    },
    {
      title: 'View Suppliers',
      description: 'Manage supplier relationships',
      icon: 'Truck',
      path: '/suppliers',
      color: 'bg-info text-white'
    }
  ];

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
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 text-center">
              <div className="text-2xl font-bold text-gray-900">{quickStats.totalProducts}</div>
              <div className="text-sm text-surface-500">Total Products</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 text-center">
              <div className="text-2xl font-bold text-gray-900">${quickStats.totalValue.toLocaleString()}</div>
              <div className="text-sm text-surface-500">Total Value</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 text-center">
              <div className={`text-2xl font-bold ${quickStats.lowStockItems > 0 ? 'text-warning' : 'text-gray-900'}`}>
                {quickStats.lowStockItems}
              </div>
              <div className="text-sm text-surface-500">Low Stock Items</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 text-center">
              <div className={`text-2xl font-bold ${quickStats.activeAlerts > 0 ? 'text-error' : 'text-gray-900'}`}>
                {quickStats.activeAlerts}
              </div>
              <div className="text-sm text-surface-500">Active Alerts</div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className="relative bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color}`}>
                <ApperIcon name={action.icon} size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-surface-600">{action.description}</p>
              
              {action.badge && (
                <span className="absolute top-4 right-4 w-6 h-6 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {action.badge}
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg p-8 shadow-sm border border-surface-200"
        >
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6 text-center">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="BarChart3" className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Real-time Monitoring</h3>
              <p className="text-surface-600">
                Track stock levels in real-time with automatic low-stock alerts and notifications
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Users" className="text-accent" size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Supplier Management</h3>
              <p className="text-surface-600">
                Maintain supplier relationships with contact info, lead times, and performance metrics
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="History" className="text-info" size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Movement Tracking</h3>
              <p className="text-surface-600">
                Complete audit trail of all stock movements with timestamps and reasons
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;