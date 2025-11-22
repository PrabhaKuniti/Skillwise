# Frontend Deployment Notes for Vercel

## Important Configuration

### Build Settings

- **Framework:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### Environment Variables

**Required:**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

**Important Notes:**
- Variables must start with `REACT_APP_` to be available in React
- Update this after backend is deployed
- Changes require redeployment

### Routing

- React Router is configured
- All routes are handled by `index.html` (SPA)
- `vercel.json` includes proper routing configuration

### API Configuration

The frontend automatically:
- Uses `REACT_APP_API_URL` from environment variables
- Falls back to `http://localhost:5000/api` if not set
- Includes JWT tokens in requests automatically
- Handles 401/403 errors by redirecting to login

### Build Process

1. Vercel runs `npm install`
2. Runs `npm run build`
3. Serves files from `build/` directory
4. Routes all requests to `index.html` for SPA

### Custom Domain

- Add custom domain in Vercel dashboard
- Update `FRONTEND_URL` in backend after adding domain
- SSL certificate is automatic

### Preview Deployments

- Every push to a branch creates a preview deployment
- Preview URLs are available for testing
- Main branch deploys to production URL

### Environment-Specific Variables

- **Production:** Set in Vercel dashboard
- **Preview:** Can override for preview deployments
- **Development:** Uses `.env.development` file locally

### Performance

- Vercel automatically optimizes assets
- CDN distribution worldwide
- Automatic HTTPS
- Automatic compression

