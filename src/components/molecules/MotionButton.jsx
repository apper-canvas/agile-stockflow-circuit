import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const MotionButton = ({ children, className, onClick, whileHover, whileTap, ...props }) => {
    return (
        <motion.div
            whileHover={whileHover || { scale: 1.05 }}
            whileTap={whileTap || { scale: 0.95 }}
            {...props}
        >
            <Button onClick={onClick} className={className}>
                {children}
            </Button>
        </motion.div>
    );
};

export default MotionButton;