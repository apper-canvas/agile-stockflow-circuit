import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const LoadingSpinner = ({ size = 24, className = 'text-primary' }) => {
    return (
        <div className="flex items-center justify-center">
            <ApperIcon name="Loader" className={`${className} animate-spin`} size={size} />
        </div>
    );
};

export default LoadingSpinner;