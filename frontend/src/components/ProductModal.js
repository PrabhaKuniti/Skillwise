import React, { useState } from 'react';
import './ProductModal.css';

const ProductModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    category: '',
    brand: '',
    stock: 0,
    status: '',
    image: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'stock' ? parseInt(value) || 0 : value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'input-error' : ''}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              id="unit"
              value={formData.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              placeholder="e.g., kg, pcs, liters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              min="0"
              className={errors.stock ? 'input-error' : ''}
              required
            />
            {errors.stock && <span className="error-message">{errors.stock}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <input
              type="text"
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;


