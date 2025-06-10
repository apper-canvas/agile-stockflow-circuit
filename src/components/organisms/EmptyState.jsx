import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import MotionButton from '@/components/molecules/MotionButton';

const EmptyState = ({
    iconName = 'Package',
    title = 'No Data Found',
    message = 'There is no data to display.',
    actionButtonText,
    onActionButtonClick,
    animateIcon = true
}) => {
    return (
        <div className="p-6 flex items-center justify-center min-h-full">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
            >
                {animateIcon ? (
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        <ApperIcon name={iconName} className="w-16 h-16 text-surface-300 mx-auto" />
                    </motion.div>
                ) : (
                    <ApperIcon name={iconName} className="w-16 h-16 text-surface-300 mx-auto" />
                )}
                <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
                <p className="mt-2 text-surface-500">{message}</p>
                {actionButtonText && onActionButtonClick && (
                    <MotionButton
                        onClick={onActionButtonClick}
                        className="mt-4 px-4 py-2 bg-primary text-white"
                    >
                        {actionButtonText}
                    </MotionButton>
                )}
            </motion.div>
        </div>
    );
};

export default EmptyState;