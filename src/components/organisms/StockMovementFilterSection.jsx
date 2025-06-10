import React from 'react';
import FilterInput from '@/components/molecules/FilterInput';
import Select from '@/components/atoms/Select';

const StockMovementFilterSection = ({ searchTerm, onSearchChange, typeFilter, onTypeFilterChange, reasonFilter, onReasonFilterChange, reasons }) => {
    const typeOptions = [
        { value: '', label: 'All Types' },
        { value: 'add', label: 'Stock Added' },
        { value: 'remove', label: 'Stock Removed' },
    ];

    const reasonOptions = [
        { value: '', label: 'All Reasons' },
        ...reasons.map(reason => ({
            value: reason,
            label: reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        }))
    ];

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <FilterInput
                className="flex-1"
                placeholder="Search movements..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />

            <Select
                value={typeFilter}
                onChange={(e) => onTypeFilterChange(e.target.value)}
                options={typeOptions}
            />

            <Select
                value={reasonFilter}
                onChange={(e) => onReasonFilterChange(e.target.value)}
                options={reasonOptions}
            />
        </div>
    );
};

export default StockMovementFilterSection;