import React, { useState, useEffect } from 'react';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
import MotionButton from '@/components/molecules/MotionButton';
import { toast } from 'react-toastify';
import { stockMovementService, productService } from '@/services'; // Ensure paths are correct

const StockAdjustmentModal = ({ isOpen, onClose, product, onProductAdjusted }) => {
    const [adjustmentData, setAdjustmentData] = useState({
        quantity: '',
        type: 'add',
        reason: 'manual_adjustment',
        notes: ''
    });

    useEffect(() => {
        // Reset form when modal opens with a new product
        if (isOpen && product) {
            setAdjustmentData({
                quantity: '',
                type: 'add',
                reason: 'manual_adjustment',
                notes: ''
            });
        }
    }, [isOpen, product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdjustmentData(prev => ({ ...prev, [name]: value }));
    };

    const handleStockAdjustment = async () => {
        if (!adjustmentData.quantity || parseInt(adjustmentData.quantity) <= 0) {
            toast.error('Please enter a valid quantity');
            return;
        }
        if (!product) {
            toast.error('No product selected for adjustment.');
            return;
        }

        try {
            const quantity = parseInt(adjustmentData.quantity);
            const movement = {
                productId: product.id,
                type: adjustmentData.type,
                quantity: quantity,
                reason: adjustmentData.reason,
                notes: adjustmentData.notes,
                timestamp: new Date().toISOString(),
                userId: 'current_user' // Placeholder
            };

            await stockMovementService.create(movement);

            const currentStock = product.currentStock;
            const newStock = adjustmentData.type === 'add'
                ? currentStock + quantity
                : Math.max(0, currentStock - quantity);

            await productService.update(product.id, {
                ...product,
                currentStock: newStock,
                lastUpdated: new Date().toISOString()
            });

            toast.success(`Stock ${adjustmentData.type === 'add' ? 'increased' : 'decreased'} successfully`);

            onProductAdjusted(); // Callback to refresh product list
            onClose(); // Close modal
        } catch (err) {
            toast.error('Failed to adjust stock');
            console.error('Stock adjustment error:', err);
        }
    };

    const reasonOptions = [
        { value: 'manual_adjustment', label: 'Manual Adjustment' },
        { value: 'damaged', label: 'Damaged' },
        { value: 'lost', label: 'Lost' },
        { value: 'returned', label: 'Returned' },
        { value: 'correction', label: 'Correction' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Adjust Stock"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <p className="text-sm text-surface-600">{product?.name}</p>
                    <p className="text-xs text-surface-500">Current stock: {product?.currentStock} {product?.unit}</p>
                </div>

                <FormField
                    label="Type"
                    type="select"
                    name="type"
                    value={adjustmentData.type}
                    onChange={handleInputChange}
                    options={[
                        { value: 'add', label: 'Add Stock' },
                        { value: 'remove', label: 'Remove Stock' },
                    ]}
                />

                <FormField
                    label="Quantity"
                    type="number"
                    name="quantity"
                    min="1"
                    value={adjustmentData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                />

                <FormField
                    label="Reason"
                    type="select"
                    name="reason"
                    value={adjustmentData.reason}
                    onChange={handleInputChange}
                    options={reasonOptions}
                />

                <FormField
                    label="Notes (Optional)"
                    type="textarea"
                    name="notes"
                    value={adjustmentData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Additional notes..."
                />
            </div>

            <div className="flex space-x-3 mt-6">
                <MotionButton
                    onClick={handleStockAdjustment}
                    className="flex-1 px-4 py-2 bg-primary text-white hover:shadow-lg"
                >
                    Confirm Adjustment
                </MotionButton>
                <MotionButton
                    onClick={onClose}
                    className="px-4 py-2 border border-surface-300 text-surface-700 hover:bg-surface-50"
                >
                    Cancel
                </MotionButton>
            </div>
        </Modal>
    );
};

export default StockAdjustmentModal;