import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { productService, stockMovementService } from '../services';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [adjustmentModal, setAdjustmentModal] = useState({ open: false, product: null });
  const [adjustmentData, setAdjustmentData] = useState({
    quantity: '',
    type: 'add',
    reason: 'manual_adjustment',
    notes: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await productService.getAll();
      setProducts(result);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = async () => {
    if (!adjustmentData.quantity || adjustmentData.quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      const quantity = parseInt(adjustmentData.quantity);
      const movement = {
        productId: adjustmentModal.product.id,
        type: adjustmentData.type,
        quantity: quantity,
        reason: adjustmentData.reason,
        notes: adjustmentData.notes,
        timestamp: new Date().toISOString(),
        userId: 'current_user'
      };

      // Create stock movement record
      await stockMovementService.create(movement);

      // Update product stock
      const currentStock = adjustmentModal.product.currentStock;
      const newStock = adjustmentData.type === 'add' 
        ? currentStock + quantity 
        : Math.max(0, currentStock - quantity);

      await productService.update(adjustmentModal.product.id, {
        ...adjustmentModal.product,
        currentStock: newStock,
        lastUpdated: new Date().toISOString()
      });

      toast.success(`Stock ${adjustmentData.type === 'add' ? 'increased' : 'decreased'} successfully`);
      
      // Refresh products
      await loadProducts();
      
      // Close modal
      setAdjustmentModal({ open: false, product: null });
      setAdjustmentData({
        quantity: '',
        type: 'add',
        reason: 'manual_adjustment',
        notes: ''
      });

    } catch (err) {
      toast.error('Failed to adjust stock');
    }
  };

  const getStockStatus = (product) => {
    if (product.currentStock <= product.minStock) return 'low';
    if (product.currentStock >= product.maxStock) return 'high';
    return 'normal';
  };

  const getStockColor = (status) => {
    switch (status) {
      case 'low': return 'bg-error';
      case 'high': return 'bg-warning';
      default: return 'bg-success';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    
    const matchesStock = !stockFilter || 
      (stockFilter === 'low' && product.currentStock <= product.minStock) ||
      (stockFilter === 'normal' && product.currentStock > product.minStock && product.currentStock < product.maxStock) ||
      (stockFilter === 'high' && product.currentStock >= product.maxStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-surface-200 rounded w-full mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Products</h3>
          <p className="text-surface-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadProducts}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (products.length === 0) {
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
            <ApperIcon name="Package" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Products Found</h3>
          <p className="mt-2 text-surface-500">
            Add your first product to start managing inventory
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Add Product
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-surface-500">Manage your inventory items</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">All Stock Levels</option>
          <option value="low">Low Stock</option>
          <option value="normal">Normal Stock</option>
          <option value="high">High Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200">
              <AnimatePresence>
                {filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product);
                  const stockPercentage = Math.min(100, (product.currentStock / product.maxStock) * 100);
                  
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-surface-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 break-words">{product.name}</div>
                        <div className="text-sm text-surface-500 break-words">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-surface-100 text-surface-700 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {product.currentStock} {product.unit}
                            </div>
                            <div className="w-full bg-surface-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${getStockColor(stockStatus)}`}
                                style={{ width: `${stockPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          {stockStatus === 'low' && (
                            <ApperIcon name="AlertTriangle" className="text-warning" size={16} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(product.currentStock * product.salePrice).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAdjustmentModal({ open: true, product })}
                          className="text-primary hover:text-primary/80 transition-colors duration-200"
                        >
                          Adjust Stock
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <AnimatePresence>
        {adjustmentModal.open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setAdjustmentModal({ open: false, product: null })}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Adjust Stock</h3>
                  <button
                    onClick={() => setAdjustmentModal({ open: false, product: null })}
                    className="text-surface-400 hover:text-surface-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <p className="text-sm text-surface-600">{adjustmentModal.product?.name}</p>
                    <p className="text-xs text-surface-500">Current stock: {adjustmentModal.product?.currentStock} {adjustmentModal.product?.unit}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={adjustmentData.type}
                      onChange={(e) => setAdjustmentData({...adjustmentData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="add">Add Stock</option>
                      <option value="remove">Remove Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={adjustmentData.quantity}
                      onChange={(e) => setAdjustmentData({...adjustmentData, quantity: e.target.value})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <select
                      value={adjustmentData.reason}
                      onChange={(e) => setAdjustmentData({...adjustmentData, reason: e.target.value})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="manual_adjustment">Manual Adjustment</option>
                      <option value="damaged">Damaged</option>
                      <option value="lost">Lost</option>
                      <option value="returned">Returned</option>
                      <option value="correction">Correction</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      value={adjustmentData.notes}
                      onChange={(e) => setAdjustmentData({...adjustmentData, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows="2"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStockAdjustment}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Confirm Adjustment
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAdjustmentModal({ open: false, product: null })}
                    className="px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Products;