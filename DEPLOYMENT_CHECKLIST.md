# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

### Backend Preparation
- [ ] Code is pushed to GitHub
- [ ] All dependencies are in `package.json`
- [ ] `backend/server.js` has correct CORS configuration
- [ ] `backend/render.yaml` exists (optional)
- [ ] Test backend locally: `npm run dev`

### Frontend Preparation
- [ ] Code is pushed to GitHub
- [ ] All dependencies are in `package.json`
- [ ] `frontend/vercel.json` exists
- [ ] Test frontend locally: `npm start`
- [ ] Build works: `npm run build`

## Backend Deployment (Render)

### Step 1: Create Service
- [ ] Go to Render dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select repository

### Step 2: Configure Service
- [ ] Name: `inventory-backend`
- [ ] Environment: `Node`
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`

### Step 3: Set Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000` (or leave Render default)
- [ ] `JWT_SECRET` = [Generate strong random string]
- [ ] `FRONTEND_URL` = [Will update after frontend deploy]

### Step 4: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Note backend URL: `https://your-backend.onrender.com`
- [ ] Test: `https://your-backend.onrender.com/api/health`

## Frontend Deployment (Vercel)

### Step 1: Import Project
- [ ] Go to Vercel dashboard
- [ ] Click "Add New..." → "Project"
- [ ] Import GitHub repository
- [ ] Select repository

### Step 2: Configure Project
- [ ] Framework: Create React App
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build` (auto-detected)
- [ ] Output Directory: `build` (auto-detected)

### Step 3: Set Environment Variables
- [ ] `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
- [ ] Replace `your-backend.onrender.com` with actual backend URL

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment (1-3 minutes)
- [ ] Note frontend URL: `https://your-frontend.vercel.app`
- [ ] Test frontend URL

## Post-Deployment

### Update Backend CORS
- [ ] Go to Render dashboard
- [ ] Update `FRONTEND_URL` environment variable
- [ ] Set to: `https://your-frontend.vercel.app`
- [ ] Save (service restarts automatically)

### Testing
- [ ] Backend health check works
- [ ] Frontend loads correctly
- [ ] Can register new user
- [ ] Can login
- [ ] Can add products
- [ ] Can edit products
- [ ] Can delete products
- [ ] CSV import works
- [ ] CSV export works
- [ ] Pagination works
- [ ] Sorting works
- [ ] Search works
- [ ] Category filter works
- [ ] Inventory history works

### Security Check
- [ ] `JWT_SECRET` is strong and random
- [ ] Environment variables not in git
- [ ] HTTPS enabled (automatic)
- [ ] CORS properly configured
- [ ] No sensitive data in logs

## Troubleshooting

### If Backend Won't Start
- [ ] Check Render logs
- [ ] Verify environment variables
- [ ] Check `package.json` scripts
- [ ] Verify Node.js version

### If Frontend Won't Build
- [ ] Check Vercel build logs
- [ ] Verify environment variables
- [ ] Check `package.json` dependencies
- [ ] Verify `vercel.json` configuration

### If CORS Errors
- [ ] Verify `FRONTEND_URL` in backend matches frontend URL exactly
- [ ] Check backend logs for CORS errors
- [ ] Ensure URLs include `https://`

### If API Calls Fail
- [ ] Verify `REACT_APP_API_URL` is correct
- [ ] Check backend is running
- [ ] Check browser console for errors
- [ ] Verify network tab in DevTools

## Final Verification

- [ ] Both services are running
- [ ] All features work correctly
- [ ] No console errors
- [ ] No CORS errors
- [ ] Authentication works
- [ ] Data persists (or understand SQLite limitations)

## Notes

- SQLite database resets on each deployment
- For production, consider PostgreSQL
- Both platforms offer free tiers
- Services auto-deploy on git push

---

**Deployment Date:** _______________
**Backend URL:** _______________
**Frontend URL:** _______________
**JWT_SECRET Set:** [ ] Yes [ ] No

