import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = ({ count = 1, className = '' }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-white rounded-lg p-6 shadow-sm animate-pulse ${className}`}
                >
                    <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-surface-200 rounded w-3/4"></div>
                </motion.div>
            ))}
        </>
    );
};

export default SkeletonCard;