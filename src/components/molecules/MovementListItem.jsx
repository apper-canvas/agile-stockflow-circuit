import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const MovementListItem = ({ movement, productName, index }) => {
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
        <motion.div
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
                    {productName}
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
    );
};

export default MovementListItem;