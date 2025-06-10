import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ label, type = 'text', options, ...props }) => {
    const Component = type === 'select' ? Select : type === 'textarea' ? Textarea : Input;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <Component
                type={type}
                options={options}
                {...props}
            />
        </div>
    );
};

export default FormField;