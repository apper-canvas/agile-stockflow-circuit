import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const MovementTableRow = ({ movement, productName, productSku, index }) => {
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

    return (
        <motion.tr
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
                    {productName}
                </div>
                <div className="text-sm text-surface-500">
                    SKU: {productSku}
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
    );
};

export default MovementTableRow;