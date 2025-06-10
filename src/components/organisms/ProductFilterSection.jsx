import React from 'react';
import FilterInput from '@/components/molecules/FilterInput';
import Select from '@/components/atoms/Select';

const ProductFilterSection = ({ searchTerm, onSearchChange, categoryFilter, onCategoryFilterChange, stockFilter, onStockFilterChange, categories }) => {
    const categoryOptions = [{ value: '', label: 'All Categories' }, ...categories.map(cat => ({ value: cat, label: cat }))];
    const stockOptions = [
        { value: '', label: 'All Stock Levels' },
        { value: 'low', label: 'Low Stock' },
        { value: 'normal', label: 'Normal Stock' },
        { value: 'high', label: 'High Stock' },
    ];

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <FilterInput
                className="flex-1"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />

            <Select
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                options={categoryOptions}
            />

            <Select
                value={stockFilter}
                onChange={(e) => onStockFilterChange(e.target.value)}
                options={stockOptions}
            />
        </div>
    );
};

export default ProductFilterSection;