# Troubleshooting Guide

## Registration/Login Error Issues

If you're seeing "An error occurred. Please try again." when trying to register or login, follow these steps:

### 1. Check Backend Server is Running

**Check if backend is running:**
```bash
# In backend directory
cd backend
npm run dev
```

You should see:
```
Server is running on port 5000
```

**If not running:**
- Make sure you're in the `backend` directory
- Check if port 5000 is already in use
- Install dependencies: `npm install`

### 2. Check Backend Dependencies

Make sure all dependencies are installed:
```bash
cd backend
npm install
```

Required packages:
- `jsonwebtoken`
- `bcryptjs`
- `express`
- `sqlite3`
- `cors`

### 3. Check Database

The database file should be created automatically. Check if `backend/inventory.db` exists.

If there are database errors, you can delete the database file and restart the server:
```bash
# Delete database (will be recreated)
rm backend/inventory.db
# Or on Windows:
del backend\inventory.db
```

### 4. Check CORS Configuration

The backend should allow requests from `http://localhost:3000`. This is configured in `backend/server.js`.

### 5. Check Network Tab in Browser

Open browser DevTools (F12) → Network tab:
- Look for the request to `/api/auth/register` or `/api/auth/login`
- Check the response status:
  - **200/201**: Success
  - **400**: Validation error (check response body for details)
  - **401**: Authentication error
  - **500**: Server error (check backend console)
  - **Failed/CORS error**: Backend not running or CORS issue

### 6. Check Backend Console

Look at the backend terminal for error messages. Common errors:
- `Database error: ...` - Database issue
- `Hash error: ...` - Password hashing issue
- `Insert error: ...` - Database insert issue

### 7. Test Backend Directly

Test if the backend is accessible:
```bash
# In browser or using curl
http://localhost:5000/api/health
```

Should return:
```json
{"status":"OK","message":"Server is running"}
```

### 8. Common Issues and Solutions

#### Issue: "Cannot connect to server"
**Solution:** 
- Make sure backend server is running on port 5000
- Check if firewall is blocking the connection
- Verify `REACT_APP_API_URL` in frontend (should be `http://localhost:5000/api`)

#### Issue: "User with this email or username already exists"
**Solution:**
- Use a different email/username
- Or delete the user from database

#### Issue: "Password must be at least 6 characters"
**Solution:**
- Enter a password with at least 6 characters

#### Issue: "Valid email is required"
**Solution:**
- Enter a valid email format (e.g., `user@example.com`)

#### Issue: CORS Error
**Solution:**
- Make sure backend CORS is configured (already done in code)
- Check that backend is running
- Clear browser cache

### 9. Reset Everything

If nothing works, try a complete reset:

```bash
# Stop all servers (Ctrl+C)

# Backend
cd backend
rm -rf node_modules
rm inventory.db
npm install
npm run dev

# Frontend (new terminal)
cd frontend
rm -rf node_modules
npm install
npm start
```

### 10. Check Environment Variables

Create `backend/.env` file:
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### 11. Verify Ports

- Backend should run on: `http://localhost:5000`
- Frontend should run on: `http://localhost:3000`

If ports are different, update:
- Backend: Change `PORT` in `.env` or `server.js`
- Frontend: Change `REACT_APP_API_URL` in `.env` or `api.js`

### 12. Browser Console Errors

Check browser console (F12 → Console tab) for JavaScript errors:
- Network errors
- CORS errors
- Authentication errors

---

## Still Having Issues?

1. **Check backend logs** - Look at the terminal where backend is running
2. **Check browser console** - Look for JavaScript errors
3. **Check network tab** - See the actual request/response
4. **Verify all files are saved** - Make sure code changes are saved
5. **Restart both servers** - Stop and restart backend and frontend

---

## Quick Test

1. Open browser to `http://localhost:5000/api/health`
   - Should show: `{"status":"OK","message":"Server is running"}`

2. Try registering with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test123` (at least 6 characters)

3. Check backend console for any error messages

4. Check browser Network tab for the actual error response


