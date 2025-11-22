import React, { useState, useEffect } from 'react';
import './ProductInventory.css';
import ProductTable from './ProductTable';
import ProductModal from './ProductModal';
import InventoryHistory from './InventoryHistory';
import { productsAPI } from '../services/api';

const ProductInventory = ({ user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyProductId, setHistoryProductId] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch products with pagination and sorting
  const fetchProducts = async (page = pagination.currentPage, resetSearch = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: pagination.itemsPerPage,
        sort: sortField,
        order: sortOrder,
      };

      if (selectedCategory && !resetSearch) {
        params.category = selectedCategory;
      }

      if (searchQuery && !resetSearch) {
        params.name = searchQuery;
      }

      const response = await productsAPI.getAll(params);
      
      if (response.data.products) {
        // New paginated response format
        setProducts(response.data.products);
        setPagination(response.data.pagination);
        
        // Extract categories from all products (we might need to fetch all for categories)
        const allCategories = [...new Set(response.data.products.map((p) => p.category).filter(Boolean))];
        setCategories(allCategories);
      } else {
        // Fallback for old format
        setProducts(response.data);
        setCategories([...new Set(response.data.map((p) => p.category).filter(Boolean))]);
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, true);
  }, [sortField, sortOrder]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchProducts(1, false);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    fetchProducts(1, false);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchProducts(newPage, false);
  };

  // Handle import
  const handleImport = async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.import(file);
      const { added, skipped, duplicates } = response.data;
      
      let message = `Import completed: ${added} products added`;
      if (skipped > 0) {
        message += `, ${skipped} skipped`;
      }
      if (duplicates && duplicates.length > 0) {
        message += ` (${duplicates.length} duplicates found)`;
      }
      
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Refresh products list
      await fetchProducts(pagination.currentPage, false);
    } catch (err) {
      setError(err.response?.data?.error || 'Import failed. Please check your CSV file.');
      console.error('Error importing products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.export();
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccessMessage('Products exported successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Export failed. Please try again.');
      console.error('Error exporting products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle product update
  const handleProductUpdate = async (id, data) => {
    try {
      const response = await productsAPI.update(id, { ...data, changedBy: user?.username || 'admin' });
      
      // Refresh products list
      await fetchProducts(pagination.currentPage, false);
      
      setSuccessMessage('Product updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update product.');
      console.error('Error updating product:', err);
      return false;
    }
  };

  // Handle product delete
  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      await productsAPI.delete(id);
      await fetchProducts(pagination.currentPage, false);
      setSuccessMessage('Product deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product.');
      console.error('Error deleting product:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle product create
  const handleProductCreate = async (data) => {
    setLoading(true);
    try {
      await productsAPI.create(data);
      setShowModal(false);
      setSuccessMessage('Product created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchProducts(pagination.currentPage, false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product.');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle row click to show history
  const handleRowClick = (productId) => {
    setHistoryProductId(productId);
    setShowHistory(true);
  };

  // Handle close history
  const handleCloseHistory = () => {
    setShowHistory(false);
    setHistoryProductId(null);
  };

  return (
    <div className="product-inventory">
      <div className="inventory-header">
        <div className="header-left">
          <div className="header-title-section">
            <h1>Product Inventory Management</h1>
            {user && (
              <div className="user-info">
                <span>Welcome, {user.username}</span>
                <button onClick={onLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="search-filter-section">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="category-filter"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              + Add New Product
            </button>
          </div>
        </div>
        <div className="header-right">
          <label className="btn btn-secondary import-btn">
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleImport(e.target.files[0]);
                }
                e.target.value = '';
              }}
              style={{ display: 'none' }}
            />
          </label>
          <button onClick={handleExport} className="btn btn-secondary">
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="alert-close">×</button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
          <button onClick={() => setSuccessMessage(null)} className="alert-close">×</button>
        </div>
      )}

      <ProductTable
        products={products}
        loading={loading}
        onUpdate={handleProductUpdate}
        onDelete={handleProductDelete}
        onRowClick={handleRowClick}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages} 
            ({pagination.totalItems} total items)
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <ProductModal
          onClose={() => setShowModal(false)}
          onSave={handleProductCreate}
        />
      )}

      {showHistory && historyProductId && (
        <InventoryHistory
          productId={historyProductId}
          onClose={handleCloseHistory}
        />
      )}
    </div>
  );
};

export default ProductInventory;
