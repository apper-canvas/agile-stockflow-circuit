import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';
import { useState, useEffect } from 'react';
import { productService } from '../services';

function MainFeature({ recentMovements, lowStockAlerts, onRefresh }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const result = await productService.getAll();
      setProducts(result);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case 'add': return 'Plus';
      case 'remove': return 'Minus';
      default: return 'ArrowUpDown';
    }
  };

  const getMovementColor = (type) => {
    switch (type) {
      case 'add': return 'text-success';
      case 'remove': return 'text-error';
      default: return 'text-surface-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Stock Movements */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200"
      >
        <div className="px-6 py-4 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Stock Movements</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/stock-movements')}
              className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
            >
              View All
            </motion.button>
          </div>
        </div>
        
        <div className="p-6">
          {recentMovements.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="ArrowUpDown" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">No recent movements</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMovements.map((movement, index) => (
                <motion.div
                  key={movement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-4 p-3 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors duration-200"
                >
                  <div className={`p-2 rounded-lg bg-white ${getMovementColor(movement.type)}`}>
                    <ApperIcon name={getMovementIcon(movement.type)} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {getProductName(movement.productId)}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-surface-500">
                      <span>
                        {movement.type === 'add' ? '+' : '-'}{movement.quantity}
                      </span>
                      <span>•</span>
                      <span>{format(new Date(movement.timestamp), 'MMM dd, h:mm a')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Low Stock Alerts */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200"
      >
        <div className="px-6 py-4 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
              {lowStockAlerts.length > 0 && (
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 bg-warning rounded-full"
                />
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/alerts')}
              className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
            >
              View All
            </motion.button>
          </div>
        </div>
        
        <div className="p-6">
          {lowStockAlerts.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="CheckCircle" className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-surface-500">All stock levels are healthy</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lowStockAlerts.slice(0, 5).map((alert, index) => {
                const product = products.find(p => p.id === alert.productId);
                if (!product) return null;

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-warning/5 border border-warning/20 rounded-lg hover:bg-warning/10 transition-colors duration-200"
                  >
                    <div className="p-2 rounded-lg bg-warning/10">
                      <ApperIcon name="AlertTriangle" className="text-warning" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-surface-500">
                        <span>Current: {alert.currentLevel} {product.unit}</span>
                        <span>•</span>
                        <span>Min: {alert.threshold} {product.unit}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/products')}
                      className="px-2 py-1 text-xs text-warning border border-warning rounded hover:bg-warning hover:text-white transition-all duration-200"
                    >
                      Adjust
                    </motion.button>
                  </motion.div>
                );
              })}
              
              {lowStockAlerts.length > 5 && (
                <div className="text-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/alerts')}
                    className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    +{lowStockAlerts.length - 5} more alerts
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default MainFeature;