import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import MotionButton from '@/components/molecules/MotionButton';

const ErrorState = ({ title = 'Failed to Load Data', message = 'An unexpected error occurred.', onRetry }) => {
    return (
        <div className="p-6 flex items-center justify-center min-h-full">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
            >
                <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-surface-500 mb-4">{message}</p>
                {onRetry && (
                    <MotionButton
                        onClick={onRetry}
                        className="px-4 py-2 bg-primary text-white hover:shadow-lg"
                    >
                        Try Again
                    </MotionButton>
                )}
            </motion.div>
        </div>
    );
};

export default ErrorState;