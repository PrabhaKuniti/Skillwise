import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    const { page, limit, sort, order, category, name } = params;
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (sort) queryParams.append('sort', sort);
    if (order) queryParams.append('order', order);
    if (category) queryParams.append('category', category);
    if (name) queryParams.append('name', name);
    return api.get(`/products?${queryParams.toString()}`);
  },
  search: (name) => api.get(`/products/search?name=${encodeURIComponent(name)}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getHistory: (id) => api.get(`/products/${id}/history`),
  import: (file) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    const token = localStorage.getItem('token');
    return api.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },
  export: () => api.get('/products/export', { responseType: 'blob' }),
};

export default api;

