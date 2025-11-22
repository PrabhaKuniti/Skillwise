# Backend Deployment Notes for Render

## Important Configuration

### Port Configuration
- Render automatically sets the `PORT` environment variable
- Our code uses `process.env.PORT || 5000`
- Render typically uses port `10000` for Node.js services
- The code will automatically use the correct port

### Database
- SQLite database file (`inventory.db`) is created automatically
- **Important:** Data is lost when service restarts or redeploys
- For production, consider using Render's PostgreSQL service

### Environment Variables Required

1. **NODE_ENV** = `production`
2. **PORT** = `10000` (Render sets this automatically)
3. **JWT_SECRET** = [Generate a strong random string]
4. **FRONTEND_URL** = `https://your-frontend.vercel.app`

### Build and Start Commands

- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Health Check

The service includes a health check endpoint:
```
GET /api/health
```

Render can use this for health checks.

### CORS Configuration

The backend is configured to accept requests from:
- The URL specified in `FRONTEND_URL` environment variable
- Localhost (for development)
- Automatically allows all origins in development mode

### File Uploads

- CSV import uses `uploads/` directory
- Make sure this directory exists (it's created automatically)
- Files are cleaned up after processing

### Logs

- Check Render dashboard → Your service → Logs tab
- All console.log statements will appear here
- Useful for debugging

### Auto-Deploy

- Render automatically deploys on git push to main branch
- Manual redeploy available in dashboard
- Rollback to previous version available

