import React from 'react';
import { motion } from 'framer-motion';

const AlertsFilterTabs = ({ filter, onFilterChange, totalAlerts, activeAlertsCount, acknowledgedAlertsCount }) => {
    const tabs = [
        { key: 'active', label: 'Active', count: activeAlertsCount },
        { key: 'acknowledged', label: 'Acknowledged', count: acknowledgedAlertsCount },
        { key: 'all', label: 'All', count: totalAlerts }
    ];

    return (
        <div className="flex space-x-1 bg-surface-100 p-1 rounded-lg max-w-md">
            {tabs.map((tab) => (
                <motion.button
                    key={tab.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onFilterChange(tab.key)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        filter === tab.key
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-surface-600 hover:text-gray-900'
                    }`}
                >
                    {tab.label} ({tab.count})
                </motion.button>
            ))}
        </div>
    );
};

export default AlertsFilterTabs;