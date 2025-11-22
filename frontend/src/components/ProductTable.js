import React, { useState } from 'react';
import './ProductTable.css';

const ProductTable = ({ products, loading, onUpdate, onDelete, onRowClick, sortField, sortOrder, onSort }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditData({
      name: product.name || '',
      unit: product.unit || '',
      category: product.category || '',
      brand: product.brand || '',
      stock: product.stock || 0,
      status: product.status || '',
      image: product.image || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    const success = await onUpdate(id, editData);
    if (success) {
      setEditingId(null);
      setEditData({});
    }
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: field === 'stock' ? parseInt(value) || 0 : value,
    }));
  };

  const getStockStatus = (stock) => {
    return stock === 0 ? 'Out of Stock' : 'In Stock';
  };

  const getStockStatusClass = (stock) => {
    return stock === 0 ? 'status-out-of-stock' : 'status-in-stock';
  };

  const SortableHeader = ({ field, children }) => {
    if (!onSort) return <th>{children}</th>;
    
    const isActive = sortField === field;
    const isAsc = isActive && sortOrder === 'ASC';
    const isDesc = isActive && sortOrder === 'DESC';
    
    return (
      <th 
        className={`sortable ${isActive ? 'active' : ''}`}
        onClick={() => onSort(field)}
      >
        {children}
        <span className="sort-indicator">
          {isAsc ? ' ▲' : isDesc ? ' ▼' : ' ⇅'}
        </span>
      </th>
    );
  };

  if (loading && products.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products found. Add a new product to get started!</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <SortableHeader field="name">Name</SortableHeader>
            <th>Unit</th>
            <SortableHeader field="category">Category</SortableHeader>
            <SortableHeader field="brand">Brand</SortableHeader>
            <SortableHeader field="stock">Stock</SortableHeader>
            <SortableHeader field="status">Status</SortableHeader>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className={editingId === product.id ? 'editing-row' : ''}
              onClick={() => editingId !== product.id && onRowClick(product.id)}
            >
              <td>
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editData.image || ''}
                    onChange={(e) => handleChange('image', e.target.value)}
                    placeholder="Image URL"
                    className="edit-input"
                  />
                ) : (
                  <div className="product-image">
                    {product.image ? (
                      <>
                        <img src={product.image} alt={product.name} onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }} />
                        <span style={{ display: 'none' }}>📦</span>
                      </>
                    ) : (
                      <span>📦</span>
                    )}
                  </div>
                )}
              </td>
              <td>
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="edit-input"
                    required
                  />
                ) : (
                  <span className="product-name">{product.name}</span>
                )}
              </td>
              <td>
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editData.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  product.unit || '-'
                )}
              </td>
              <td>
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  product.category || '-'
                )}
              </td>
              <td>
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  product.brand || '-'
                )}
              </td>
              <td>
                {editingId === product.id ? (
                  <input
                    type="number"
                    value={editData.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    className="edit-input"
                    min="0"
                    required
                  />
                ) : (
                  product.stock
                )}
              </td>
              <td>
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span className={`status-badge ${getStockStatusClass(product.stock)}`}>
                    {getStockStatus(product.stock)}
                  </span>
                )}
              </td>
              <td>
                {editingId === product.id ? (
                  <div className="action-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(product.id);
                      }}
                      className="btn-save"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel();
                      }}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="action-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(product.id);
                      }}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

