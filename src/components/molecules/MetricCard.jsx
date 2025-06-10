import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({ iconName, iconColor, bgColor, label, value, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-shadow duration-200"
        >
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
                        <ApperIcon name={iconName} className={iconColor} size={20} />
                    </div>
                </div>
                <div className="ml-4 min-w-0 flex-1">
                    <p className="text-sm font-medium text-surface-500 truncate">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {value}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default MetricCard;