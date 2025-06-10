import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ value, label, valueClassName = '', delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 text-center"
        >
            <div className={`text-2xl font-bold ${valueClassName}`}>
                {value}
            </div>
            <div className="text-sm text-surface-500">{label}</div>
        </motion.div>
    );
};

export default StatCard;