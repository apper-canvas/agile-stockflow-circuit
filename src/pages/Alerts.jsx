import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { alertService, productService } from '../services';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [alertsResult, productsResult] = await Promise.all([
        alertService.getAll(),
        productService.getAll()
      ]);
      
      setAlerts(alertsResult);
      setProducts(productsResult);
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      const alert = alerts.find(a => a.id === alertId);
      await alertService.update(alertId, {
        ...alert,
        acknowledgedAt: new Date().toISOString()
      });
      
      toast.success('Alert acknowledged');
      await loadData();
    } catch (err) {
      toast.error('Failed to acknowledge alert');
    }
  };

  const getProduct = (productId) => {
    return products.find(p => p.id === productId);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'low_stock': return 'AlertTriangle';
      case 'out_of_stock': return 'XCircle';
      case 'high_stock': return 'TrendingUp';
      default: return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'low_stock': return 'text-warning bg-warning/10 border-warning/20';
      case 'out_of_stock': return 'text-error bg-error/10 border-error/20';
      case 'high_stock': return 'text-info bg-info/10 border-info/20';
      default: return 'text-surface-600 bg-surface-100 border-surface-200';
    }
  };

  const getPriorityLevel = (alert) => {
    if (alert.type === 'out_of_stock') return 'critical';
    if (alert.type === 'low_stock' && alert.currentLevel === 0) return 'critical';
    if (alert.type === 'low_stock') return 'high';
    return 'medium';
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.triggered && !alert.acknowledgedAt;
    if (filter === 'acknowledged') return alert.acknowledgedAt;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-surface-200 rounded w-full mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-surface-200 rounded-lg"></div>
            ))}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Alerts</h3>
          <p className="text-surface-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Alerts</h1>
          <p className="mt-1 text-surface-500">Monitor stock level warnings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200"
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-surface-100 p-1 rounded-lg max-w-md">
        {[
          { key: 'active', label: 'Active', count: alerts.filter(a => a.triggered && !a.acknowledgedAt).length },
          { key: 'acknowledged', label: 'Acknowledged', count: alerts.filter(a => a.acknowledgedAt).length },
          { key: 'all', label: 'All', count: alerts.length }
        ].map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              filter === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-surface-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </motion.button>
        ))}
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Bell" className="w-16 h-16 text-surface-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {filter === 'active' ? 'No Active Alerts' : 'No Alerts Found'}
            </h3>
            <p className="mt-2 text-surface-500">
              {filter === 'active' 
                ? 'All stock levels are within normal ranges'
                : 'No alerts match the current filter'
              }
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAlerts
              .sort((a, b) => {
                // Sort by priority (critical first), then by timestamp
                const priorityOrder = { critical: 0, high: 1, medium: 2 };
                const aPriority = getPriorityLevel(a);
                const bPriority = getPriorityLevel(b);
                
                if (aPriority !== bPriority) {
                  return priorityOrder[aPriority] - priorityOrder[bPriority];
                }
                
                return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
              })
              .map((alert, index) => {
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
                        <div className={`p-2 rounded-lg ${getAlertColor(alert.type)}`}>
                          <ApperIcon name={getAlertIcon(alert.type)} size={20} />
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
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                          >
                            Acknowledge
                          </motion.button>
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
      )}
    </div>
  );
}

export default Alerts;