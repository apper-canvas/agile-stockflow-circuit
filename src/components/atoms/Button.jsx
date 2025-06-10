import React from 'react';

const Button = ({ onClick, children, className = '', type = 'button', ...props }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;