# Detailed Testing Guide for Product Inventory Management System

This guide will walk you through testing all features of the application step by step.

## Prerequisites

- Node.js (v14 or higher) installed
- npm (comes with Node.js)
- A web browser (Chrome, Firefox, Edge, etc.)

---

## Step 1: Initial Setup

### 1.1 Install Backend Dependencies

Open a terminal/command prompt and navigate to the project root, then:

```bash
cd backend
npm install
```

**Expected Result:** All backend dependencies should be installed without errors.

**What to check:**
- No error messages
- `node_modules` folder is created in the `backend` directory
- Installation completes successfully

### 1.2 Install Frontend Dependencies

In a new terminal/command prompt window:

```bash
cd frontend
npm install
```

**Expected Result:** All frontend dependencies should be installed without errors.

**What to check:**
- No error messages
- `node_modules` folder is created in the `frontend` directory
- Installation completes successfully

---

## Step 2: Start the Servers

### 2.1 Start Backend Server

In the backend terminal:

```bash
cd backend
npm run dev
```

**Expected Result:** You should see:
```
Server is running on port 5000
```

**What to check:**
- Server starts without errors
- Port 5000 is available (if you see "port already in use", change PORT in `.env` file)
- `inventory.db` file is created in the `backend` directory (after first API call)

### 2.2 Start Frontend Server

In the frontend terminal:

```bash
cd frontend
npm start
```

**Expected Result:** 
- Browser automatically opens to `http://localhost:3000`
- React app compiles successfully
- You see the "Product Inventory Management" page

**What to check:**
- No compilation errors
- Page loads with header, search bar, and empty product table (or "No products found" message)

---

## Step 3: Testing Core Features

### 3.1 Test: Add New Product (Manual Entry)

**Steps:**
1. Click the **"+ Add New Product"** button
2. Fill in the form:
   - **Name:** `Test Laptop` (required)
   - **Unit:** `unit`
   - **Category:** `Electronics`
   - **Brand:** `Dell`
   - **Stock:** `50`
   - **Status:** `Active`
   - **Image URL:** `https://example.com/laptop.jpg` (optional)
3. Click **"Save Product"**

**Expected Result:**
- Modal closes
- Success message appears: "Product created successfully!"
- New product appears in the table
- Product shows with green "In Stock" status (since stock > 0)

**What to check:**
- Product appears in the table immediately
- All fields are displayed correctly
- Image displays (if URL is valid) or shows 📦 emoji if invalid/missing
- Stock status is green "In Stock"

**Test Edge Cases:**
- Try adding a product with empty name → Should show validation error
- Try adding a product with negative stock → Should show validation error
- Try adding a product with duplicate name → Should show error message

---

### 3.2 Test: Add Multiple Products

**Steps:**
Add at least 5-6 products with different categories:
- Product 1: Name: `Wireless Mouse`, Category: `Electronics`, Stock: `100`
- Product 2: Name: `Office Chair`, Category: `Furniture`, Stock: `25`
- Product 3: Name: `Notebook`, Category: `Stationery`, Stock: `0` (to test Out of Stock)
- Product 4: Name: `USB Cable`, Category: `Electronics`, Stock: `200`
- Product 5: Name: `Desk Lamp`, Category: `Furniture`, Stock: `15`

**Expected Result:**
- All products appear in the table
- Products with stock = 0 show red "Out of Stock" status
- Products with stock > 0 show green "In Stock" status

**What to check:**
- All products are visible
- Status colors are correct
- Table is scrollable if many products

---

### 3.3 Test: Search Functionality

**Steps:**
1. Type `Mouse` in the search bar
2. Observe the results

**Expected Result:**
- Table filters to show only products containing "Mouse" in the name
- Search is case-insensitive (try `mouse`, `MOUSE`, `Mouse`)

**What to check:**
- Real-time filtering as you type
- Partial matches work (e.g., "lap" finds "Laptop")
- Search works with multiple words
- Clear search shows all products again

**Test Cases:**
- Search for non-existent product → Table should be empty or show "No products found"
- Search with special characters → Should handle gracefully
- Clear search → All products should reappear

---

### 3.4 Test: Category Filter

**Steps:**
1. Click the **Category filter dropdown**
2. Select `Electronics`
3. Observe the results

**Expected Result:**
- Only products with category "Electronics" are shown
- Filter works independently of search

**What to check:**
- Dropdown shows all unique categories from your products
- Selecting a category filters the table
- "All Categories" option shows all products
- Filter works in combination with search

**Test Cases:**
- Select a category with no products → Should show empty state
- Combine search + category filter → Should show intersection of both filters
- Clear category filter → All products should reappear

---

### 3.5 Test: Inline Editing

**Steps:**
1. Find a product in the table
2. Click the **"Edit"** button for that product
3. Observe the row changes to editable mode
4. Modify some fields:
   - Change **Stock** from `50` to `75`
   - Change **Category** to `Computers`
   - Change **Brand** to `HP`
5. Click **"Save"**

**Expected Result:**
- Row shows input fields when editing
- Save and Cancel buttons appear
- After saving, row returns to display mode
- Updated values are reflected immediately
- Success message appears
- If stock changed, inventory history is logged

**What to check:**
- All fields except Image and ID are editable
- Input fields are pre-filled with current values
- Save button updates the product
- Cancel button discards changes
- Optimistic update (UI updates before server response)

**Test Edge Cases:**
- Try to save with empty name → Should show validation error
- Try to save with negative stock → Should show validation error
- Try to save with duplicate name → Should show error
- Click Cancel → Changes should be discarded
- Edit stock from 50 to 0 → Status should change to "Out of Stock"

---

### 3.6 Test: Delete Product

**Steps:**
1. Find a product you want to delete
2. Click the **"Delete"** button
3. Confirm the deletion in the popup dialog
4. Observe the result

**Expected Result:**
- Confirmation dialog appears
- Product is removed from the table after confirmation
- Success message appears
- Product is permanently deleted from database

**What to check:**
- Confirmation dialog prevents accidental deletion
- Product disappears from table immediately
- If you cancel, product remains

**Test Edge Cases:**
- Click Cancel in confirmation → Product should remain
- Delete a product with inventory history → Product and history should be deleted (CASCADE)

---

### 3.7 Test: Inventory History Tracking

**Steps:**
1. Click on any product row (not the Edit/Delete buttons)
2. Observe the sidebar that opens from the right
3. Check the history table

**Expected Result:**
- Sidebar slides in from the right
- Shows product name at the top
- Displays inventory change history in a table
- Shows columns: Date, Old Stock, New Stock, Change, Changed By

**What to check:**
- Sidebar opens when clicking a row
- History is sorted by date (newest first)
- Shows all stock changes for that product
- Change column shows +X for increases, -X for decreases
- Close button (×) closes the sidebar

**To Generate History:**
1. Edit a product and change its stock (e.g., from 50 to 75)
2. Save the changes
3. Click on that product row
4. You should see a new entry in the history

**Test Cases:**
- Product with no history → Should show "No inventory changes recorded"
- Multiple stock changes → All should be listed
- Click outside sidebar → Should close
- Click close button → Should close

---

### 3.8 Test: CSV Import

**Steps:**
1. Prepare a CSV file (you can use the provided `sample-products.csv` or create your own)
2. Click the **"Import CSV"** button
3. Select your CSV file
4. Wait for the import to complete
5. Observe the results

**CSV Format:**
```csv
name,unit,category,brand,stock,status,image
Product A,unit,Category1,Brand1,100,Active,https://example.com/image1.jpg
Product B,kg,Category2,Brand2,50,Active,https://example.com/image2.jpg
```

**Expected Result:**
- File picker opens
- After selection, import processes
- Success message shows: "Import completed: X products added, Y skipped"
- New products appear in the table
- Duplicate products (by name) are skipped

**What to check:**
- Import button triggers file picker
- Only CSV files are accepted
- Products are added to the table
- Duplicate detection works (case-insensitive)
- Success message shows correct counts

**Test Cases:**
- Import valid CSV → Products should be added
- Import CSV with duplicates → Duplicates should be skipped, message shows count
- Import invalid CSV → Should show error message
- Import empty CSV → Should show error message
- Import CSV with missing required fields → Should skip invalid rows

**Create Test CSV:**
Create a file `test-import.csv`:
```csv
name,unit,category,brand,stock,status,image
Test Product 1,unit,Test Category,Test Brand,25,Active,
Test Product 2,kg,Test Category,Another Brand,50,Active,
```

---

### 3.9 Test: CSV Export

**Steps:**
1. Make sure you have some products in the system
2. Click the **"Export CSV"** button
3. Check your Downloads folder

**Expected Result:**
- CSV file downloads automatically
- File is named `products.csv`
- File contains all products with headers
- All product fields are included

**What to check:**
- Download starts immediately
- File opens correctly in Excel/Google Sheets
- All products are included
- Headers are correct: `id,name,unit,category,brand,stock,status,image`
- Data is properly formatted

**Verify Export:**
1. Open the downloaded CSV file
2. Check that all products are present
3. Verify data integrity (compare with table data)
4. Check that special characters are handled correctly

---

## Step 4: Testing Error Handling

### 4.1 Test: Network Errors

**Steps:**
1. Stop the backend server
2. Try to perform any action (add, edit, delete, search)
3. Observe error messages

**Expected Result:**
- Error messages appear in red alert boxes
- User-friendly error messages
- Application doesn't crash

**What to check:**
- Error messages are clear
- Alerts can be dismissed (× button)
- Application remains functional

### 4.2 Test: Validation Errors

**Steps:**
1. Try to add a product with empty name
2. Try to add a product with negative stock
3. Try to edit a product to have duplicate name

**Expected Result:**
- Validation errors appear
- Form doesn't submit
- Error messages are specific

---

## Step 5: Testing Responsive Design

### 5.1 Test: Mobile View

**Steps:**
1. Open browser developer tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device (e.g., iPhone 12)
4. Test all features

**Expected Result:**
- Layout adapts to smaller screens
- Table is horizontally scrollable
- Buttons are accessible
- Sidebar works on mobile
- Text is readable

**What to check:**
- Search bar and filters stack vertically on mobile
- Table scrolls horizontally
- Buttons are large enough to tap
- Modal is responsive
- Sidebar takes full width on mobile

### 5.2 Test: Tablet View

**Steps:**
1. Resize browser to tablet dimensions (768px - 1024px)
2. Test all features

**Expected Result:**
- Layout adapts appropriately
- All features remain functional

---

## Step 6: Integration Testing

### 6.1 Complete Workflow Test

**Scenario:** Complete product lifecycle

**Steps:**
1. **Create:** Add a new product "Test Product" with stock 100
2. **View:** Verify it appears in the table
3. **Search:** Search for "Test" and verify it appears
4. **Filter:** Filter by category and verify
5. **Edit:** Change stock to 150 and save
6. **History:** Click on product row and verify history shows the change
7. **Edit Again:** Change stock to 0 (Out of Stock)
8. **Verify Status:** Check that status changed to red "Out of Stock"
9. **Export:** Export CSV and verify product is included
10. **Delete:** Delete the product
11. **Verify:** Confirm it's removed from table

**Expected Result:**
- All steps complete successfully
- Data persists correctly
- UI updates reflect changes
- No errors occur

---

## Step 7: Database Verification

### 7.1 Check Database Directly

**Steps:**
1. Install a SQLite browser (e.g., DB Browser for SQLite)
2. Open `backend/inventory.db`
3. Check tables and data

**Expected Result:**
- `products` table contains all products
- `inventory_history` table contains stock change records
- Foreign key relationships are correct

**What to check:**
- Products table has correct schema
- History table has correct schema
- Data integrity is maintained
- Foreign keys work (CASCADE delete)

---

## Common Issues and Solutions

### Issue: Backend won't start
**Solution:** 
- Check if port 5000 is already in use
- Change PORT in `backend/.env` file
- Make sure all dependencies are installed

### Issue: Frontend won't compile
**Solution:**
- Check for syntax errors
- Delete `node_modules` and reinstall: `npm install`
- Clear npm cache: `npm cache clean --force`

### Issue: CORS errors
**Solution:**
- Verify backend CORS is enabled
- Check API URL in frontend (should be `http://localhost:5000/api`)

### Issue: Database errors
**Solution:**
- Delete `inventory.db` and restart server (will recreate)
- Check file permissions on `backend` directory

### Issue: CSV import not working
**Solution:**
- Verify CSV format matches expected structure
- Check file encoding (should be UTF-8)
- Ensure `uploads` directory exists in backend

---

## Testing Checklist

Use this checklist to ensure all features are tested:

- [ ] Backend server starts successfully
- [ ] Frontend compiles and runs
- [ ] Add new product (manual)
- [ ] Add product with validation errors
- [ ] Search functionality
- [ ] Category filter
- [ ] Inline editing
- [ ] Edit with validation errors
- [ ] Delete product
- [ ] Inventory history sidebar
- [ ] CSV import (valid file)
- [ ] CSV import (duplicates)
- [ ] CSV import (invalid file)
- [ ] CSV export
- [ ] Stock status color coding
- [ ] Responsive design (mobile)
- [ ] Error handling
- [ ] Complete workflow test

---

## Performance Testing

### Test with Large Dataset

**Steps:**
1. Import a CSV with 100+ products
2. Test search performance
3. Test filter performance
4. Test table rendering

**Expected Result:**
- Application remains responsive
- Search is fast
- Table scrolls smoothly
- No UI freezing

---

## Security Testing

### Test Input Validation

**Steps:**
1. Try SQL injection in search: `'; DROP TABLE products; --`
2. Try XSS in product name: `<script>alert('XSS')</script>`
3. Try very long strings in fields

**Expected Result:**
- Input is sanitized
- No SQL injection possible
- XSS attempts are escaped
- Long strings are handled gracefully

---

## Conclusion

After completing all these tests, you should have verified:
- ✅ All core features work correctly
- ✅ Error handling is robust
- ✅ UI is responsive
- ✅ Data integrity is maintained
- ✅ User experience is smooth

If you encounter any issues during testing, refer to the "Common Issues and Solutions" section or check the browser console and server logs for detailed error messages.


