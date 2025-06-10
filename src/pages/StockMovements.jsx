import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { stockMovementService, productService } from '../services';

function StockMovements() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [reasonFilter, setReasonFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [movementsResult, productsResult] = await Promise.all([
        stockMovementService.getAll(),
        productService.getAll()
      ]);
      
      setMovements(movementsResult);
      setProducts(productsResult);
    } catch (err) {
      setError(err.message || 'Failed to load stock movements');
      toast.error('Failed to load stock movements');
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getProductSku = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.sku : 'N/A';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'add': return 'text-success bg-success/10';
      case 'remove': return 'text-error bg-error/10';
      default: return 'text-surface-600 bg-surface-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'add': return 'Plus';
      case 'remove': return 'Minus';
      default: return 'ArrowUpDown';
    }
  };

  const filteredMovements = movements.filter(movement => {
    const productName = getProductName(movement.productId);
    const productSku = getProductSku(movement.productId);
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || movement.type === typeFilter;
    const matchesReason = !reasonFilter || movement.reason === reasonFilter;

    return matchesSearch && matchesType && matchesReason;
  });

  const reasons = [...new Set(movements.map(m => m.reason))];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-surface-200 rounded w-full mb-6"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-200 rounded"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Stock Movements</h3>
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

  if (movements.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="ArrowUpDown" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Stock Movements</h3>
          <p className="mt-2 text-surface-500">
            Stock movements will appear here as you adjust inventory
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Stock Movements</h1>
          <p className="mt-1 text-surface-500">Track all inventory transactions</p>
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
            <input
              type="text"
              placeholder="Search movements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value="add">Stock Added</option>
          <option value="remove">Stock Removed</option>
        </select>

        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">All Reasons</option>
          {reasons.map(reason => (
            <option key={reason} value={reason}>
              {reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200">
              {filteredMovements
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((movement, index) => (
                  <motion.tr
                    key={movement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(movement.timestamp), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-surface-500">
                        {format(new Date(movement.timestamp), 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 break-words">
                        {getProductName(movement.productId)}
                      </div>
                      <div className="text-sm text-surface-500">
                        SKU: {getProductSku(movement.productId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(movement.type)}`}>
                        <ApperIcon name={getTypeIcon(movement.type)} className="mr-1" size={12} />
                        {movement.type === 'add' ? 'Added' : 'Removed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${movement.type === 'add' ? 'text-success' : 'text-error'}`}>
                        {movement.type === 'add' ? '+' : '-'}{movement.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-surface-100 text-surface-700 rounded-full">
                        {movement.reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-surface-500 break-words max-w-xs">
                        {movement.notes || '-'}
                      </div>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredMovements.length === 0 && (
        <div className="text-center py-8">
          <ApperIcon name="Search" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No movements found</h3>
          <p className="text-surface-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}

export default StockMovements;