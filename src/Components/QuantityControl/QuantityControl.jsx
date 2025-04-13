import React, { useState } from 'react';
import './QuantityControl.css';

const QuantityControl = ({ value, onChange }) => {
    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            const num = value === '' ? '' : parseInt(value);
            onChange?.(num);
        }
    };

    const decrease = () => {
        const newVal = Math.max(1, (parseInt(value) || 1) - 1);
        onChange?.(newVal);
    };

    const increase = () => {
        const newVal = (parseInt(value) || 0) + 1;
        onChange?.(newVal);
    };

    return (
        <div className="quantity-control">
            <button className="qty-btn" onClick={decrease}>-</button>
            <input
                type="text"
                className="qty-input"
                value={value}
                onChange={handleChange}
            />
            <button className="qty-btn" onClick={increase}>+</button>
        </div>
    );
};

export default QuantityControl;
