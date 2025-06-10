import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { supplierService, productService } from '../services';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [suppliersResult, productsResult] = await Promise.all([
        supplierService.getAll(),
        productService.getAll()
      ]);
      
      setSuppliers(suppliersResult);
      setProducts(productsResult);
    } catch (err) {
      setError(err.message || 'Failed to load suppliers');
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const getSupplierProducts = (supplierId) => {
    return products.filter(product => product.supplierId === supplierId);
  };

  const getSupplierMetrics = (supplierId) => {
    const supplierProducts = getSupplierProducts(supplierId);
    const totalProducts = supplierProducts.length;
    const totalValue = supplierProducts.reduce((sum, product) => 
      sum + (product.currentStock * product.salePrice), 0
    );
    const lowStockProducts = supplierProducts.filter(product => 
      product.currentStock <= product.minStock
    ).length;

    return { totalProducts, totalValue, lowStockProducts };
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-surface-200 rounded w-full mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-surface-200 rounded-lg"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Suppliers</h3>
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

  if (suppliers.length === 0) {
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
            <ApperIcon name="Truck" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Suppliers Found</h3>
          <p className="mt-2 text-surface-500">
            Add suppliers to manage your product sourcing
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Add Supplier
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Suppliers</h1>
          <p className="mt-1 text-surface-500">Manage your supplier relationships</p>
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

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier, index) => {
          const metrics = getSupplierMetrics(supplier.id);
          const supplierProducts = getSupplierProducts(supplier.id);
          
          return (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Supplier Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Truck" className="text-primary" size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 break-words">{supplier.name}</h3>
                    <p className="text-sm text-surface-500 break-words">{supplier.contactName}</p>
                  </div>
                </div>
                {metrics.lowStockProducts > 0 && (
                  <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                    {metrics.lowStockProducts} Low Stock
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-surface-600">
                  <ApperIcon name="Mail" size={14} />
                  <span className="break-words">{supplier.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-surface-600">
                  <ApperIcon name="Phone" size={14} />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-surface-600">
                  <ApperIcon name="MapPin" size={14} />
                  <span className="break-words">{supplier.address}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{metrics.totalProducts}</div>
                  <div className="text-xs text-surface-500">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    ${metrics.totalValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-surface-500">Value</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{supplier.leadTime}</div>
                  <div className="text-xs text-surface-500">Days Lead</div>
                </div>
              </div>

              {/* Products List */}
              {supplierProducts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Products ({supplierProducts.length})</h4>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {supplierProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center justify-between text-xs">
                        <span className="text-surface-600 truncate">{product.name}</span>
                        <span className={`font-medium ${
                          product.currentStock <= product.minStock ? 'text-warning' : 'text-surface-500'
                        }`}>
                          {product.currentStock} {product.unit}
                        </span>
                      </div>
                    ))}
                    {supplierProducts.length > 3 && (
                      <div className="text-xs text-surface-400">
                        +{supplierProducts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-surface-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredSuppliers.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <ApperIcon name="Search" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No suppliers found</h3>
          <p className="text-surface-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}

export default Suppliers;