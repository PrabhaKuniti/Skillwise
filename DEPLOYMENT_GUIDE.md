# Deployment Guide

This guide will walk you through deploying the Product Inventory Management System:
- **Backend** on Render
- **Frontend** on Vercel

---

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

---

## Part 1: Deploy Backend on Render

### Step 1: Prepare Your Repository

1. Make sure your code is pushed to GitHub
2. Ensure `backend/` folder contains all necessary files

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository containing your code

### Step 3: Configure the Service

**Basic Settings:**
- **Name:** `inventory-backend` (or your preferred name)
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Environment Variables:**
Click **"Add Environment Variable"** and add:

```
NODE_ENV = production
PORT = 10000
JWT_SECRET = [Generate a strong random string - use a password generator]
FRONTEND_URL = https://your-frontend.vercel.app
```

**Important Notes:**
- Render automatically sets `PORT`, but we use 10000 as default
- Generate a strong `JWT_SECRET` (at least 32 characters)
- `FRONTEND_URL` will be set after frontend deployment (update it then)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (usually 2-5 minutes)
4. Note your service URL: `https://your-service-name.onrender.com`

### Step 5: Test Backend

1. Visit: `https://your-service-name.onrender.com/api/health`
2. Should return: `{"status":"OK","message":"Server is running"}`

### Step 6: Update Environment Variables

After frontend is deployed, update `FRONTEND_URL` in Render dashboard:
1. Go to your service → **Environment**
2. Update `FRONTEND_URL` to your Vercel frontend URL
3. Save changes (service will restart automatically)

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Prepare Frontend

1. Make sure `frontend/` folder is in your repository
2. Verify `vercel.json` exists in `frontend/` directory

### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository

### Step 3: Configure Project

**Framework Preset:**
- Select **"Create React App"** (or leave as "Other")

**Root Directory:**
- Set to `frontend`

**Build Settings:**
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `build` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

**Environment Variables:**
Click **"Add"** and add:

```
REACT_APP_API_URL = https://your-backend.onrender.com/api
```

**Important:**
- Replace `your-backend.onrender.com` with your actual Render backend URL
- Environment variables starting with `REACT_APP_` are available in React

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your app
3. Wait for deployment (usually 1-3 minutes)
4. Note your frontend URL: `https://your-project.vercel.app`

### Step 5: Update Backend CORS

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable to your Vercel URL
3. Service will automatically restart

### Step 6: Test Frontend

1. Visit your Vercel URL
2. You should see the login page
3. Try registering a new user
4. Test the application

---

## Part 3: Post-Deployment Configuration

### Update CORS in Backend

After both are deployed:

1. **Render Dashboard** → Your service → **Environment**
2. Update `FRONTEND_URL` to: `https://your-frontend.vercel.app`
3. Save (service restarts)

### Verify Everything Works

1. **Backend Health Check:**
   ```
   https://your-backend.onrender.com/api/health
   ```

2. **Frontend:**
   ```
   https://your-frontend.vercel.app
   ```

3. **Test Flow:**
   - Register a new user
   - Login
   - Add products
   - Test all features

---

## Environment Variables Summary

### Backend (Render)

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Server port (Render sets this automatically) |
| `JWT_SECRET` | `[random string]` | Secret for JWT tokens (generate strong random string) |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Frontend URL for CORS |

### Frontend (Vercel)

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend.onrender.com/api` | Backend API URL |

---

## Troubleshooting

### Backend Issues

**Issue: Service won't start**
- Check build logs in Render dashboard
- Verify `package.json` has correct `start` script
- Check environment variables are set

**Issue: Database errors**
- SQLite database is created automatically
- Each deployment creates a fresh database (data doesn't persist)
- For production, consider using PostgreSQL (Render offers free tier)

**Issue: CORS errors**
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check backend logs for CORS errors
- Ensure URL includes `https://`

### Frontend Issues

**Issue: Can't connect to backend**
- Verify `REACT_APP_API_URL` is set correctly
- Check backend is running (visit health endpoint)
- Check browser console for errors

**Issue: Build fails**
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure `vercel.json` is correct

**Issue: 401/403 errors**
- Check if backend is accessible
- Verify JWT_SECRET is set in backend
- Clear browser localStorage and try again

### Common Solutions

1. **Clear browser cache and localStorage**
2. **Redeploy both services**
3. **Check service logs** in both Render and Vercel dashboards
4. **Verify environment variables** are set correctly
5. **Test backend directly** using curl or Postman

---

## Database Considerations

### Current Setup (SQLite)
- **Pros:** Simple, no setup needed
- **Cons:** Data doesn't persist between deployments, not suitable for production

### Production Recommendation: PostgreSQL

For production, use Render's PostgreSQL:

1. **Create PostgreSQL Database:**
   - Render Dashboard → **New +** → **PostgreSQL**
   - Note connection string

2. **Update Backend:**
   - Install `pg` package: `npm install pg`
   - Update `db.js` to use PostgreSQL
   - Set `DATABASE_URL` environment variable

3. **Benefits:**
   - Data persists
   - Better performance
   - Free tier available on Render

---

## Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel project → **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` in Render

### Render Custom Domain

1. Go to Render service → **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records
4. Update `REACT_APP_API_URL` in Vercel

---

## Monitoring and Logs

### Render Logs
- View logs in Render dashboard → Your service → **Logs** tab
- Real-time logs available
- Check for errors and warnings

### Vercel Logs
- View logs in Vercel dashboard → Your project → **Deployments** → Click deployment → **Logs**
- Build logs and runtime logs available

---

## Updating Your Application

### Backend Updates

1. Push changes to GitHub
2. Render automatically detects changes
3. Triggers new deployment
4. Service restarts with new code

### Frontend Updates

1. Push changes to GitHub
2. Vercel automatically detects changes
3. Builds and deploys new version
4. Updates are live immediately

### Environment Variable Updates

- **Render:** Update in dashboard → Service restarts automatically
- **Vercel:** Update in dashboard → Redeploy required (or automatic on next push)

---

## Security Checklist

- [ ] Strong `JWT_SECRET` (32+ characters, random)
- [ ] `FRONTEND_URL` set correctly in backend
- [ ] `REACT_APP_API_URL` set correctly in frontend
- [ ] HTTPS enabled (automatic on both platforms)
- [ ] Environment variables not committed to git
- [ ] CORS properly configured
- [ ] Database credentials secure (if using PostgreSQL)

---

## Cost Information

### Render Free Tier
- **Web Services:** Free tier available (spins down after inactivity)
- **PostgreSQL:** Free tier available (limited)
- **Limitations:** Services may spin down after 15 minutes of inactivity

### Vercel Free Tier
- **Hosting:** Free tier available
- **Bandwidth:** Generous free tier
- **Builds:** Unlimited builds
- **Limitations:** None for small projects

---

## Support Resources

- **Render Docs:** [https://render.com/docs](https://render.com/docs)
- **Vercel Docs:** [https://vercel.com/docs](https://vercel.com/docs)
- **Project Issues:** Check GitHub issues or create new one

---

## Quick Reference

### Backend URL Format
```
https://your-service-name.onrender.com
```

### Frontend URL Format
```
https://your-project.vercel.app
```

### API Endpoints
```
https://your-backend.onrender.com/api/health
https://your-backend.onrender.com/api/auth/register
https://your-backend.onrender.com/api/auth/login
https://your-backend.onrender.com/api/products
```

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Set up monitoring
3. ✅ Configure custom domain (optional)
4. ✅ Set up database backups (if using PostgreSQL)
5. ✅ Add error tracking (optional)
6. ✅ Set up CI/CD (optional)

Good luck with your deployment! 🚀

