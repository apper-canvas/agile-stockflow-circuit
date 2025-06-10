import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import MovementListItem from '@/components/molecules/MovementListItem';
import MotionButton from '@/components/molecules/MotionButton';
import { productService } from '@/services'; // Ensure this path is correct

const RecentStockMovementsList = ({ recentMovements }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const result = await productService.getAll();
                setProducts(result);
            } catch (err) {
                console.error('Failed to load products for movement list:', err);
            }
        };
        loadProducts();
    }, []);

    const getProductName = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.name : 'Unknown Product';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
            <div className="px-6 py-4 border-b border-surface-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Recent Stock Movements</h3>
                    <MotionButton
                        onClick={() => navigate('/stock-movements')}
                        className="text-sm text-primary hover:text-primary/80"
                    >
                        View All
                    </MotionButton>
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
                            <MovementListItem
                                key={movement.id}
                                movement={movement}
                                productName={getProductName(movement.productId)}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default RecentStockMovementsList;