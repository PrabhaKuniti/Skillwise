# Product Inventory Management System

A complete full-stack application for managing product inventory with search, filtering, inline editing, CSV import/export, and inventory change history tracking.

## Features

### Frontend (React)
- ✅ Product search with real-time filtering
- ✅ Category filter dropdown
- ✅ Add new product modal
- ✅ Products table with inline editing
- ✅ Stock status color coding (Green: In Stock, Red: Out of Stock)
- ✅ CSV import/export functionality
- ✅ Inventory history sidebar
- ✅ Responsive design

### Backend (Node.js + Express + SQLite)
- ✅ RESTful API endpoints
- ✅ Product CRUD operations
- ✅ CSV import with duplicate detection
- ✅ CSV export
- ✅ Inventory history tracking
- ✅ Input validation

## Project Structure

```
SkillWiseAssignment/
├── backend/
│   ├── routes/
│   │   └── products.js      # Product API routes
│   ├── db.js                # Database initialization
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductInventory.js
│   │   │   ├── ProductTable.js
│   │   │   ├── ProductModal.js
│   │   │   └── InventoryHistory.js
│   │   ├── services/
│   │   │   └── api.js       # API service
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create an `uploads` directory (for CSV imports):
```bash
mkdir uploads
```

4. Start the server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search?name=<query>` - Search products by name
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/:id/history` - Get inventory history for a product

### Import/Export
- `POST /api/products/import` - Import products from CSV (multipart/form-data)
- `GET /api/products/export` - Export all products as CSV

## CSV Format

### Import CSV Format
The CSV file should have the following columns:
```csv
name,unit,category,brand,stock,status,image
Product Name,kg,Category,Brand Name,100,Active,https://example.com/image.jpg
```

### Export CSV Format
The exported CSV includes all product fields: `id,name,unit,category,brand,stock,status,image`

## Usage

1. **Search Products**: Type in the search bar to filter products by name
2. **Filter by Category**: Select a category from the dropdown
3. **Add Product**: Click "Add New Product" button and fill in the form
4. **Edit Product**: Click "Edit" button on any product row to enable inline editing
5. **Delete Product**: Click "Delete" button to remove a product
6. **View History**: Click on any product row to view its inventory change history
7. **Import CSV**: Click "Import CSV" to upload a CSV file with products
8. **Export CSV**: Click "Export CSV" to download all products as a CSV file

## Technologies Used

### Backend
- Node.js
- Express.js
- SQLite3
- Multer (file uploads)
- CSV Parser
- Express Validator

### Frontend
- React
- Axios
- CSS3

## Database Schema

### Products Table
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT UNIQUE NOT NULL)
- `unit` (TEXT)
- `category` (TEXT)
- `brand` (TEXT)
- `stock` (INTEGER NOT NULL)
- `status` (TEXT)
- `image` (TEXT)

### Inventory History Table
- `id` (INTEGER PRIMARY KEY)
- `product_id` (INTEGER FOREIGN KEY)
- `old_quantity` (INTEGER)
- `new_quantity` (INTEGER)
- `change_date` (TEXT)
- `changed_by` (TEXT)

## Notes

- The database file (`inventory.db`) will be created automatically on first run
- CSV imports skip duplicate products (based on case-insensitive name matching)
- Inventory history is automatically tracked when stock is updated
- All API endpoints include proper error handling and validation


