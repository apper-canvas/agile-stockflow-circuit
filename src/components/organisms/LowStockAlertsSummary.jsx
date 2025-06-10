import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import AlertListItem from '@/components/molecules/AlertListItem';
import MotionButton from '@/components/molecules/MotionButton';
import { productService } from '@/services'; // Ensure this path is correct

const LowStockAlertsSummary = ({ lowStockAlerts }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const result = await productService.getAll();
                setProducts(result);
            } catch (err) {
                console.error('Failed to load products for alert list:', err);
            }
        };
        loadProducts();
    }, []);

    const getProduct = (productId) => {
        return products.find(p => p.id === productId);
    };

    return (
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
                    <MotionButton
                        onClick={() => navigate('/alerts')}
                        className="text-sm text-primary hover:text-primary/80"
                    >
                        View All
                    </MotionButton>
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
                            const product = getProduct(alert.productId);
                            return (
                                <AlertListItem
                                    key={alert.id}
                                    alert={alert}
                                    product={product}
                                    index={index}
                                    showAdjustButton={true}
                                    showStatusBadges={false} // Hide acknowledged badge for summary
                                />
                            );
                        })}

                        {lowStockAlerts.length > 5 && (
                            <div className="text-center pt-2">
                                <MotionButton
                                    onClick={() => navigate('/alerts')}
                                    className="text-sm text-primary hover:text-primary/80"
                                >
                                    +{lowStockAlerts.length - 5} more alerts
                                </MotionButton>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default LowStockAlertsSummary;