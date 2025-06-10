import React from 'react';

const SkeletonRow = ({ count = 1, className = '' }) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className="h-16 bg-surface-200 rounded animate-pulse"></div>
            ))}
        </div>
    );
};

export default SkeletonRow;