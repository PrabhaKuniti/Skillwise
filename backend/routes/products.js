const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { body, validationResult, param } = require('express-validator');
const db = require('../db');

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// GET /api/products - Get all products with pagination and sorting
router.get('/', (req, res) => {
  const { category, name, page, limit, sort, order } = req.query;
  
  // Pagination defaults
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;
  
  // Sorting defaults
  const sortField = sort || 'id';
  const sortOrder = (order && order.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
  
  // Validate sort field to prevent SQL injection
  const allowedSortFields = ['id', 'name', 'category', 'brand', 'stock', 'status'];
  const safeSortField = allowedSortFields.includes(sortField.toLowerCase()) 
    ? sortField.toLowerCase() 
    : 'id';
  
  let query = 'SELECT * FROM products WHERE 1=1';
  let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
  const params = [];
  const countParams = [];

  if (category) {
    query += ' AND category = ?';
    countQuery += ' AND category = ?';
    params.push(category);
    countParams.push(category);
  }

  if (name) {
    query += ' AND name LIKE ?';
    countQuery += ' AND name LIKE ?';
    params.push(`%${name}%`);
    countParams.push(`%${name}%`);
  }

  query += ` ORDER BY ${safeSortField} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(limitNum, offset);

  // Get total count for pagination
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const total = countResult.total;
    const totalPages = Math.ceil(total / limitNum);
    
    // Get paginated results
    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        products: rows,
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      });
    });
  });
});

// GET /api/products/search?name=<query> - Search products by name
router.get('/search', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name query parameter is required' });
  }

  const query = 'SELECT * FROM products WHERE name LIKE ? COLLATE NOCASE ORDER BY id DESC';
  const searchTerm = `%${name}%`;

  db.all(query, [searchTerm], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/products/export - Export products to CSV (must come before /:id)
router.get('/export', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Convert to CSV
    const headers = ['id', 'name', 'unit', 'category', 'brand', 'stock', 'status', 'image'];
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    rows.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header] || '';
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.status(200).send(csvContent);
  });
});

// POST /api/products/import - Import products from CSV (must come before /:id)
router.post('/import', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded' });
  }

  const filePath = req.file.path;
  const results = {
    added: 0,
    skipped: 0,
    duplicates: []
  };

  const products = [];

  // Read and parse CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      products.push({
        name: row.name?.trim(),
        unit: row.unit?.trim() || null,
        category: row.category?.trim() || null,
        brand: row.brand?.trim() || null,
        stock: parseInt(row.stock) || 0,
        status: row.status?.trim() || null,
        image: row.image?.trim() || null
      });
    })
    .on('end', () => {
      // Clean up uploaded file
      fs.unlinkSync(filePath);

      if (products.length === 0) {
        return res.status(400).json({ error: 'CSV file is empty or invalid' });
      }

      let processed = 0;

      products.forEach((product) => {
        if (!product.name) {
          results.skipped++;
          processed++;
          if (processed === products.length) {
            res.json(results);
          }
          return;
        }

        // Check for duplicate by name (case-insensitive)
        db.get('SELECT id, name FROM products WHERE name = ? COLLATE NOCASE', [product.name], (err, existing) => {
          if (err) {
            console.error('Error checking duplicate:', err);
            results.skipped++;
            processed++;
            if (processed === products.length) {
              res.json(results);
            }
            return;
          }

          if (existing) {
            results.skipped++;
            results.duplicates.push({
              name: existing.name,
              existingId: existing.id
            });
            processed++;
            if (processed === products.length) {
              res.json(results);
            }
          } else {
            // Insert new product
            const insertQuery = `INSERT INTO products (name, unit, category, brand, stock, status, image)
                                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(insertQuery, [
              product.name,
              product.unit,
              product.category,
              product.brand,
              product.stock,
              product.status,
              product.image
            ], (err) => {
              if (err) {
                console.error('Error inserting product:', err);
                results.skipped++;
              } else {
                results.added++;
              }
              
              processed++;
              if (processed === products.length) {
                res.json(results);
              }
            });
          }
        });
      });
    })
    .on('error', (err) => {
      fs.unlinkSync(filePath);
      res.status(500).json({ error: 'Error parsing CSV file: ' + err.message });
    });
});

// GET /api/products/:id/history - Get inventory history for a product (must come before /:id)
router.get('/:id/history', (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM inventory_history 
                 WHERE product_id = ? 
                 ORDER BY change_date DESC`;

  db.all(query, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// POST /api/products - Create new product
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, unit, category, brand, stock, status, image } = req.body;

  // Check if product with same name exists
  db.get('SELECT id FROM products WHERE name = ? COLLATE NOCASE', [name], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (existing) {
      return res.status(400).json({ error: 'Product with this name already exists' });
    }

    const query = `INSERT INTO products (name, unit, category, brand, stock, status, image) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [name, unit || null, category || null, brand || null, stock || 0, status || null, image || null], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Fetch the created product
      db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, product) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(product);
      });
    });
  });
});

// PUT /api/products/:id - Update product
router.put('/:id', [
  param('id').isInt().withMessage('Invalid product ID'),
  body('name').notEmpty().withMessage('Name is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, unit, category, brand, stock, status, image, changedBy } = req.body;

  // First, get the current product data
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, currentProduct) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!currentProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if name is unique (excluding current product)
    db.get('SELECT id FROM products WHERE name = ? COLLATE NOCASE AND id != ?', [name, id], (err, existing) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (existing) {
        return res.status(400).json({ error: 'Product with this name already exists' });
      }

      // Update the product
      const updateQuery = `UPDATE products 
                          SET name = ?, unit = ?, category = ?, brand = ?, stock = ?, status = ?, image = ?
                          WHERE id = ?`;
      
      db.run(updateQuery, [name, unit || null, category || null, brand || null, stock || 0, status || null, image || null, id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Track inventory history if stock changed
        const oldStock = currentProduct.stock;
        const newStock = stock || 0;
        
        if (oldStock !== newStock) {
          const historyQuery = `INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, changed_by)
                               VALUES (?, ?, ?, ?, ?)`;
          const timestamp = new Date().toISOString();
          const user = changedBy || 'admin';
          
          db.run(historyQuery, [id, oldStock, newStock, timestamp, user], (err) => {
            if (err) {
              console.error('Error logging inventory history:', err);
            }
          });
        }

        // Fetch updated product
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, updatedProduct) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(updatedProduct);
        });
      });
    });
  });
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Product deleted successfully' });
    });
  });
});

module.exports = router;

