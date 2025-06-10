import React from 'react';
import FilterInput from '@/components/molecules/FilterInput';

const SupplierFilterSection = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="max-w-md">
            <FilterInput
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
};

export default SupplierFilterSection;