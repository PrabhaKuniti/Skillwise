# Vercel Deployment - Quick Guide

## Your Backend URL
```
https://skillwise-zli0.onrender.com
```

## Frontend Deployment Steps

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Select the repository containing your code

### Step 3: Configure Project

**Framework Preset:**
- Select **"Create React App"** (or it will auto-detect)

**Root Directory:**
- Set to: `frontend`

**Build Settings:**
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `build` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Step 4: Set Environment Variable

**IMPORTANT:** Before deploying, add this environment variable:

1. Click **"Environment Variables"** section
2. Click **"Add"**
3. Add:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://skillwise-zli0.onrender.com/api`
4. Make sure it's set for **Production**, **Preview**, and **Development**

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (1-3 minutes)
3. Your frontend will be live!

### Step 6: Update Backend CORS

After frontend is deployed:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service (`skillwise-zli0`)
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` to your Vercel frontend URL
   - Example: `https://your-project.vercel.app`
5. Save changes (service will restart)

## Environment Variable Summary

### In Vercel Dashboard:
```
REACT_APP_API_URL = https://skillwise-zli0.onrender.com/api
```

### In Render Dashboard (after frontend deploy):
```
FRONTEND_URL = https://your-frontend.vercel.app
```

## Testing

1. **Backend Health Check:**
   ```
   https://skillwise-zli0.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Frontend:**
   - Visit your Vercel URL
   - Should see login page
   - Try registering a new user

## Troubleshooting

### If API calls fail:
- Verify `REACT_APP_API_URL` is set in Vercel
- Check backend is running (visit health endpoint)
- Check browser console for errors

### If CORS errors:
- Update `FRONTEND_URL` in Render dashboard
- Make sure URL includes `https://`
- Wait for service to restart

## Quick Reference

- **Backend:** https://skillwise-zli0.onrender.com
- **Backend API:** https://skillwise-zli0.onrender.com/api
- **Frontend:** https://your-project.vercel.app (after deployment)

Good luck! 🚀

