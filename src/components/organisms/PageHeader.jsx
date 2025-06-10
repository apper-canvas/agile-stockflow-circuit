import React from 'react';
import MotionButton from '@/components/molecules/MotionButton';
import ApperIcon from '@/components/ApperIcon';

const PageHeader = ({ title, description, onRefresh }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">{title}</h1>
                <p className="mt-1 text-surface-500">{description}</p>
            </div>
            {onRefresh && (
                <MotionButton
                    onClick={onRefresh}
                    className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:shadow-lg"
                >
                    <ApperIcon name="RefreshCw" size={16} />
                    <span>Refresh</span>
                </MotionButton>
            )}
        </div>
    );
};

export default PageHeader;