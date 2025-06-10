import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from '@/components/molecules/FeatureCard';

const FeaturesOverviewSection = () => {
    const features = [
        {
            icon: 'BarChart3',
            iconColor: 'text-primary',
            title: 'Real-time Monitoring',
            description: 'Track stock levels in real-time with automatic low-stock alerts and notifications'
        },
        {
            icon: 'Users',
            iconColor: 'text-accent',
            title: 'Supplier Management',
            description: 'Maintain supplier relationships with contact info, lead times, and performance metrics'
        },
        {
            icon: 'History',
            iconColor: 'text-info',
            title: 'Movement Tracking',
            description: 'Complete audit trail of all stock movements with timestamps and reasons'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg p-8 shadow-sm border border-surface-200"
        >
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6 text-center">
                Key Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </motion.div>
    );
};

export default FeaturesOverviewSection;