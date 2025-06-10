import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import MotionButton from '@/components/molecules/MotionButton';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const AlertListItem = ({ alert, product, index, showAdjustButton = true, acknowledgeAlert, showStatusBadges = true }) => {
    const navigate = useNavigate();

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
            case 'low_stock': return 'bg-warning/10';
            case 'out_of_stock': return 'bg-error/10';
            case 'high_stock': return 'bg-info/10';
            default: return 'bg-surface-100';
        }
    };

    const getPriorityLevel = (alert) => {
        if (alert.type === 'out_of_stock') return 'critical';
        if (alert.type === 'low_stock' && alert.currentLevel === 0) return 'critical';
        if (alert.type === 'low_stock') return 'high';
        return 'medium';
    };

    if (!product) return null; // Ensure product is available

    const priority = getPriorityLevel(alert);
    const primaryColorClass = priority === 'critical' ? 'text-error' : priority === 'high' ? 'text-warning' : 'text-info';
    const bgColorClass = getAlertColor(alert.type);

    return (
        <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-4 p-3 ${bgColorClass} rounded-lg hover:brightness-95 transition-all duration-200`}
        >
            <div className={`p-2 rounded-lg ${bgColorClass} ${primaryColorClass}`}>
                <ApperIcon name={getAlertIcon(alert.type)} size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-surface-500">
                    <span>Current: {alert.currentLevel} {product.unit}</span>
                    <span>•</span>
                    <span>Min: {alert.threshold} {product.unit}</span>
                    {showStatusBadges && alert.acknowledgedAt && (
                        <>
                            <span>•</span>
                            <span className="text-success font-medium">ACKNOWLEDGED</span>
                        </>
                    )}
                </div>
            </div>
            {showAdjustButton && !alert.acknowledgedAt && (
                <MotionButton
                    onClick={() => navigate('/products')}
                    className="px-2 py-1 text-xs text-warning border border-warning rounded hover:bg-warning hover:text-white"
                >
                    Adjust
                </MotionButton>
            )}
            {acknowledgeAlert && !alert.acknowledgedAt && (
                <MotionButton
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white"
                >
                    Acknowledge
                </MotionButton>
            )}
        </motion.div>
    );
};

export default AlertListItem;