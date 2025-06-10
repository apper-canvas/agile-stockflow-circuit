import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const FeatureCard = ({ icon, iconColor, title, description }) => {
    return (
        <div className="text-center">
            <div className={`w-16 h-16 ${iconColor}/10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <ApperIcon name={icon} className={iconColor} size={28} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-surface-600">
                {description}
            </p>
        </div>
    );
};

export default FeatureCard;