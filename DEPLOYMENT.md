# JobConnect Production Deployment Guide

This guide describes how to deploy the Job Portal (Frontend & Backend) to production platforms such as **Vercel**, **Netlify**, **Render**, **Railway**, and **MongoDB Atlas**, ensuring company records, jobs, authentication, and file uploads work seamlessly.

---

## 1. MongoDB Database Setup (MongoDB Atlas)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Security** -> **Database Access**, create a database user (e.g. `jobportal_user`) with Read and Write privileges.
3. Under **Security** -> **Network Access**, click **Add IP Address** -> select **Allow Access from Anywhere** (`0.0.0.0/0`).
4. Under **Deployment** -> **Database**, click **Connect** -> choose **Drivers** (Node.js) -> copy your connection URI:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobconnect?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your database credentials).*

> **Auto-Seeding Note:** When the backend starts up connected to a new/empty MongoDB database, it automatically initializes all 46 Indian companies and MNCs, starter admin & recruiter accounts, and initial job listings. No manual terminal execution of `seed.js` is required.

---

## 2. Backend Deployment (Render / Railway)

### On Render (Web Service)
1. In the Render Dashboard, click **New +** -> **Web Service**.
2. Connect the GitHub repository: `https://github.com/Umaharini102/Job-Portal.git`.
3. Configure the service settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. In **Environment Variables**, add the following:

| Variable Name | Example Production Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `5000` *(Render sets this automatically)* | Backend HTTP Port |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/jobconnect?retryWrites=true&w=majority` | Your MongoDB Atlas Connection String |
| `JWT_SECRET` | `your_secure_random_jwt_secret_key_prod_2025` | Secret key for JWT authentication |
| `JWT_EXPIRES_IN` | `30d` | Token expiry duration |
| `CLIENT_URL` | `https://your-jobportal.vercel.app` | Your deployed frontend URL (can be comma-separated if multiple) |

5. Click **Deploy Web Service**. Once deployed, copy your backend URL (e.g., `https://job-portal-api.onrender.com`).

---

## 3. Frontend Deployment (Vercel / Netlify)

### On Vercel
1. In the Vercel Dashboard, click **Add New...** -> **Project**.
2. Import the GitHub repository: `https://github.com/Umaharini102/Job-Portal.git`.
3. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **Environment Variables** and add:

| Variable Name | Production Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` | **CRITICAL:** Full URL to your deployed backend API ending in `/api` |
| `VITE_BACKEND_URL` | `https://your-backend.onrender.com` | Base URL to your backend (for uploaded media/logos) |

> **IMPORTANT:** In Vite, `VITE_API_URL` is baked into the client bundle at **build time**. If you change this environment variable later, you must trigger a **Redeploy** on Vercel/Netlify for the new value to take effect.

5. Click **Deploy**.
6. Once the frontend deployment finishes, copy the frontend URL (e.g. `https://job-portal.vercel.app`) and update the `CLIENT_URL` environment variable on your backend (Render/Railway).

---

## 4. Environment Variables Quick Reference

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/jobconnect?retryWrites=true&w=majority
JWT_SECRET=production_secret_key_replace_with_random_string
JWT_EXPIRES_IN=30d
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_BACKEND_URL=https://your-backend.onrender.com
```

---

## 5. Verification Checklist

1. **Companies Directory:** Navigate to `https://your-frontend.vercel.app/companies`. You should immediately see the directory of Indian Companies and MNCs with logos, categories, and dynamic job counts.
2. **Home Page Featured Companies:** Navigate to `https://your-frontend.vercel.app`. Verify that the Featured Companies section populates dynamically.
3. **Health Check:** Open `https://your-backend.onrender.com/api/health` in your browser. It should return `{"status":"healthy","service":"JobConnect API"}`.
4. **Companies API Endpoint:** Open `https://your-backend.onrender.com/api/companies?page=1&limit=5` in your browser. It should return HTTP 200 with company records JSON.
