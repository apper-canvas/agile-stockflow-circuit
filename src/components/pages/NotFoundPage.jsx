import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import MotionButton from '@/components/molecules/MotionButton';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Package" className="w-16 h-16 text-surface-300 mx-auto" />
        </motion.div>

        <h1 className="mt-4 text-4xl font-heading font-bold text-gray-900">404</h1>
        <h2 className="mt-2 text-xl font-medium text-secondary">Page Not Found</h2>
        <p className="mt-4 text-surface-500">
          The page you're looking for doesn't exist in the inventory system.
        </p>

        <div className="mt-8 space-x-4">
          <MotionButton
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary text-white font-medium hover:shadow-lg"
          >
            Go to Dashboard
          </MotionButton>

          <MotionButton
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-surface-300 text-secondary font-medium hover:bg-surface-50"
          >
            Go Back
          </MotionButton>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;