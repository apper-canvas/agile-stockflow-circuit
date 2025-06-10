import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const FilterInput = ({ placeholder, value, onChange, className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-2" // override default padding for icon
            />
        </div>
    );
};

export default FilterInput;