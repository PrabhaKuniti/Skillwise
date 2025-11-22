import React, { useState, useEffect } from 'react';
import './InventoryHistory.css';
import { productsAPI } from '../services/api';

const InventoryHistory = ({ productId, onClose }) => {
  const [history, setHistory] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [historyResponse, productResponse] = await Promise.all([
          productsAPI.getHistory(productId),
          productsAPI.getById(productId),
        ]);
        setHistory(historyResponse.data);
        setProduct(productResponse.data);
      } catch (err) {
        setError('Failed to load inventory history.');
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <div>
            <h2>Inventory History</h2>
            {product && <p className="product-name">{product.name}</p>}
          </div>
          <button className="history-close" onClick={onClose}>×</button>
        </div>

        <div className="history-content">
          {loading ? (
            <div className="history-loading">
              <div className="spinner"></div>
              <p>Loading history...</p>
            </div>
          ) : error ? (
            <div className="history-error">
              <p>{error}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="history-empty">
              <p>No inventory changes recorded for this product.</p>
            </div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Old Stock</th>
                  <th>New Stock</th>
                  <th>Change</th>
                  <th>Changed By</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => {
                  const change = entry.new_quantity - entry.old_quantity;
                  const changeClass = change > 0 ? 'change-positive' : change < 0 ? 'change-negative' : '';
                  return (
                    <tr key={entry.id}>
                      <td>{formatDate(entry.change_date)}</td>
                      <td>{entry.old_quantity}</td>
                      <td>{entry.new_quantity}</td>
                      <td className={changeClass}>
                        {change > 0 ? '+' : ''}{change}
                      </td>
                      <td>{entry.changed_by || 'admin'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryHistory;


