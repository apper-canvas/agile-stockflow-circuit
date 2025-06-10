import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import MotionButton from '@/components/molecules/MotionButton';

const QuickActionsSection = ({ quickStats }) => {
    const navigate = useNavigate();

    const quickActions = [
        {
            title: 'View Dashboard',
            description: 'See comprehensive inventory overview',
            icon: 'LayoutDashboard',
            path: '/dashboard',
            color: 'bg-primary text-white'
        },
        {
            title: 'Manage Products',
            description: 'Add, edit, and adjust stock levels',
            icon: 'Package',
            path: '/products',
            color: 'bg-accent text-white'
        },
        {
            title: 'Check Alerts',
            description: 'Review low stock warnings',
            icon: 'AlertTriangle',
            path: '/alerts',
            color: 'bg-warning text-white',
            badge: quickStats.activeAlerts > 0 ? quickStats.activeAlerts : null
        },
        {
            title: 'View Suppliers',
            description: 'Manage supplier relationships',
            icon: 'Truck',
            path: '/suppliers',
            color: 'bg-info text-white'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
            {quickActions.map((action, index) => (
                <MotionButton
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    onClick={() => navigate(action.path)}
                    className="relative bg-white p-6 shadow-sm border border-surface-200 hover:shadow-lg text-left"
                >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color}`}>
                        <ApperIcon name={action.icon} size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-surface-600">{action.description}</p>

                    {action.badge && (
                        <span className="absolute top-4 right-4 w-6 h-6 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {action.badge}
                        </span>
                    )}
                </MotionButton>
            ))}
        </motion.div>
    );
};

export default QuickActionsSection;