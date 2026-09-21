# JobConnect Production Deployment Guide

This guide contains the exact configurations for your live Job Portal deployment:
- **Frontend (Vercel):** `https://job-portal-gin9yb0ra-umaharini102.vercel.app`
- **Backend (Render):** `https://job-portal-1how-to-deploy.onrender.com`
- **Repository:** `https://github.com/Umaharini102/Job-Portal.git`

---

## 1. Render Backend Configuration

### Service Settings
In your Render Dashboard ([dashboard.render.com](https://dashboard.render.com)):
1. Select your service: **`job-portal-1how-to-deploy`**
2. In **Settings**:
   - **Root Directory:** `backend` (or leave empty if using root — root `package.json` now supports both)
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js` (or `npm start`)
   - **Node Version:** 18 or 20

3. In **Environment Variables**, configure the following:

| Variable Name | Recommended Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Enables production mode |
| `PORT` | `5000` | Render sets this automatically, but you can define it |
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/jobconnect?retryWrites=true&w=majority` | **CRITICAL:** Your MongoDB Atlas cluster connection string |
| `JWT_SECRET` | `jobconnect_super_secret_jwt_key_2025_secure_xyz987` | Any secure secret string |
| `JWT_EXPIRES_IN` | `30d` | Token expiry duration |
| `CLIENT_URL` | `https://job-portal-gin9yb0ra-umaharini102.vercel.app` | Your deployed Vercel frontend URL |

> **IMPORTANT - Fixing 502 Bad Gateway on Render:**
> Render serves a 502 Bad Gateway when the Node process crashes on startup or cannot connect to MongoDB.
> 1. Ensure `MONGO_URI` is added in your Render Environment Variables.
> 2. In **MongoDB Atlas** -> **Network Access**, ensure IP `0.0.0.0/0` (Allow access from anywhere) is active so Render can connect.
> 3. Trigger **Manual Deploy** -> **Clear build cache & deploy** on Render.
> 4. Once deployed, `initDatabase()` will automatically seed all 46 real companies into your MongoDB Atlas database on first startup!

---

## 2. Vercel Frontend Configuration

In your Vercel Dashboard ([vercel.com](https://vercel.com)):
1. Select your project: **`job-portal`**
2. Go to **Settings** -> **Environment Variables**:
   Add the following variables:

| Variable Name | Value | Purpose |
|---|---|---|
| `VITE_API_URL` | `https://job-portal-1how-to-deploy.onrender.com/api` | Direct API endpoint (includes `/api`) |
| `VITE_BACKEND_URL` | `https://job-portal-1how-to-deploy.onrender.com` | Base backend URL for uploaded media/logos |

> **CRITICAL NOTE ON VERCEL DEPLOYMENT:**
> Vite embeds environment variables into JavaScript bundle chunks during `npm run build`.
> 1. After adding or modifying `VITE_API_URL`, you **must** go to **Deployments** in Vercel.
> 2. Click the three dots (`...`) on the latest deployment -> select **Redeploy**.
> 3. Ensure *"Use existing build cache"* is **unchecked** so Vite rebuilds with the new backend URL.

---

## 3. End-to-End Flow Verification

Once Render is live and Vercel is redeployed:
1. **Health Check:** Open `https://job-portal-1how-to-deploy.onrender.com/api/health` in your browser.
   Expected response:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "service": "JobConnect API"
   }
   ```
2. **Companies API Endpoint:** Open `https://job-portal-1how-to-deploy.onrender.com/api/companies?page=1&limit=5` in your browser.
   Expected response:
   ```json
   {
     "success": true,
     "total": 46,
     "totalPages": 10,
     "currentPage": 1,
     "companies": [...]
   }
   ```
3. **Companies Frontend Page:** Open `https://job-portal-gin9yb0ra-umaharini102.vercel.app/companies`.
   The cards for TCS, Infosys, Wipro, Accenture, Microsoft, Google, etc. will render directly from the Render backend and MongoDB database.
