# JobConnect — Full-Stack Job Portal (LinkedIn Clone)

JobConnect is a modern, responsive, deployment-ready professional career networking and hiring platform inspired by LinkedIn. It bridges the gap between ambitious job seekers, hiring recruiters, and administrators with a secure, feature-rich experience.

---

## 🌟 Key Highlights & Features

### 👤 1. Job Seeker
- **Smart Profile Management**: Editable professional profile with photo upload, custom headline, bio, structured work experience, education history, key projects (with GitHub & Live links), certifications, career goals, and resume upload (PDF/DOC).
- **Multi-Faceted Job Search**: Search by keywords, title, skills, company name, or location.
- **Deep Filters**: Filter by Job Type (Full Time, Part Time, Internship, Contract, Freelance), Workplace Mode (Remote, Hybrid, On-site), Experience Level (Entry, Mid, Senior, Lead, Executive), Minimum Salary, and Date Posted.
- **Sorting & Pagination**: Sort by newest, oldest, salary high-to-low, and salary low-to-high.
- **1-Click Smart Apply**: Apply using saved profile resume or upload a custom resume and cover letter per application. Duplicate applications are automatically prevented.
- **Application Lifecycle Tracking**: Track application progression across real-time stages:
  - `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview` ➔ `Selected` ➔ `Rejected`
- **Bookmarks & Saved Jobs**: Save jobs for later review with 1-click apply and remove.
- **In-App Notifications**: Instant notifications with unread badge indicators when recruiters update application status.
- **Account Security**: Change password and manage account settings.

---

### 🏢 2. Recruiter & Employer
- **Dedicated Recruiter Portal & Analytics**: Visual dashboard with Recharts metrics:
  - Total jobs posted & active status breakdown
  - Application volume trend charts
  - Candidate pipeline stage distribution (interactive donut chart)
  - Applications per job posting
- **Job Lifecycle Management**: Post jobs, edit listings, close/reopen postings, or delete jobs.
- **Candidate Pipeline Management**:
  - Filter applicants by specific job opening
  - Search candidates by name or technical skills
  - Inspect candidate profiles and cover notes
  - Download candidate resumes in 1 click
  - Change candidate stage (`Applied`, `Under Review`, `Shortlisted`, `Interview`, `Selected`, `Rejected`) which triggers an automatic notification to the applicant.
- **Company Branding**: Dedicated company profile with company logo upload, description, headquarters location, company size, website link, and industry.

---

### 🛡️ 3. Platform Admin
- **Super Admin Dashboard**: Full platform overview displaying total registered users, seekers, recruiters, active jobs, and application volume.
- **User Moderation**: Directory of all users with search, role filtering, instant active/deactivation toggle, and safe cascade deletion.
- **Job Moderation**: Platform-wide job search, status toggles, and deletion of fraudulent or inappropriate jobs.
- **Content Reports Queue**: Moderation queue for flagged job postings with reason, reporter details, and 1-click resolve/delete action.
- **Platform Analytics**: Visualizations of user growth velocity, contract types, and workplace distribution.

---

### ⚡ 4. Evaluation Testing Accounts & Dynamic Seeker Flow
- **Dynamic Job Seeker Registration**: Normal users register through `/register` with their own personal name, email, password, confirm password, phone number, and location. Profiles, skills, education, and resumes are saved dynamically in MongoDB. Zero hardcoded personal seekers exist.
- **Generic Testing Accounts** (Documented for Grading & Verification):
  - **Admin**: `admin@jobconnect.com` / `Admin@123`
  - **Recruiter**: `recruiter@jobconnect.com` / `Recruiter@123` (TechCorp Solutions)

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS v3, Axios, Lucide React, Recharts |
| **Backend** | Node.js, Express.js, REST API, JavaScript |
| **Database** | MongoDB & Mongoose ODM (Indexes, Relations & Schemas) |
| **Auth & Security** | JWT (JSON Web Tokens), bcrypt.js, Role-Based Route Guards, CORS |
| **File Uploads** | Multer disk storage (Avatars, Company Logos, PDF Resumes) |

---

## 📂 Project Structure

```text
portal/
├── backend/
│   ├── config/             # Database connection (db.js)
│   ├── controllers/        # Express route controllers
│   │   ├── adminController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── notificationController.js
│   │   ├── profileController.js
│   │   ├── savedJobController.js
│   │   └── userController.js
│   ├── middleware/         # authMiddleware, uploadMiddleware, errorMiddleware
│   ├── models/             # Mongoose schemas (User, Job, Application, etc.)
│   ├── routes/             # Express API routes
│   ├── services/           # Seed script (seed.js)
│   ├── uploads/            # Uploaded avatars, logos, and resumes
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Cards, Common (Navbar, Footer, Modal, Badge), Modals
│   │   ├── context/        # AuthContext, ToastContext
│   │   ├── pages/          # Public, Seeker, Recruiter, Admin pages
│   │   ├── services/       # Centralized Axios instance (api.js)
│   │   ├── App.jsx
│   │   ├── index.css       # Tailwind CSS & custom styling
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── package.json            # Root orchestrator with concurrently
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js**: v18 or higher (tested on Node v22)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### Step 1: Clone or Navigate to the Project Root
```bash
cd portal
```

### Step 2: Install All Dependencies
You can install dependencies for root, backend, and frontend with:
```bash
npm run install:all
```
Or individually:
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

## 🔑 Environment Variables

### Backend Configuration (`backend/.env`)
Create `backend/.env` with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/jobconnect
JWT_SECRET=jobconnect_super_secret_jwt_key_2025_secure_xyz987
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:3000
```

### Frontend Configuration (`frontend/.env`)
Create `frontend/.env` with the following variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

---

## 🗄️ Database Seeding (Demo Data)

Populate the database with demo users, company profiles, 10 realistic jobs, sample applications, bookmarks, and notifications:

```bash
cd backend
npm run seed
```

### 📋 Evaluation Demo Accounts
| Role | Email | Password | Details |
|---|---|---|---|
| **Admin** | `admin@jobconnect.com` | `Admin@123` | Full platform moderation, users, recruiters, jobs, applications |
| **Recruiter** | `recruiter@jobconnect.com` | `Recruiter@123` | TechCorp Solutions, applicant management, job postings |
| **Job Seeker** | *Dynamic* | *User Defined* | Register via `/register` to test dynamic user onboarding |

---

## 🚀 Running the Application

### Option A: Run Both Together from Root
```bash
npm start
```
This runs both the Express backend and Vite frontend concurrently.

### Option B: Run Individually

**Terminal 1 — Backend (Port 5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (Port 3000):**
```bash
cd frontend
npm start
```

Visit the application in your browser at:
👉 **`http://localhost:3000`**

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new Job Seeker or Recruiter
- `POST /api/auth/login` — Login user & return JWT token
- `GET /api/auth/me` — Return current authenticated user profile
- `POST /api/auth/logout` — Logout user
- `PUT /api/auth/updatepassword` — Change password

### 💼 Jobs (`/api/jobs`)
- `GET /api/jobs` — Multi-filter search (keywords, location, type, experience, salary, workMode, date, sort, pagination)
- `GET /api/jobs/:id` — Single job details with applied & saved status check
- `POST /api/jobs` — Create job listing (Recruiter only)
- `PUT /api/jobs/:id` — Update job listing (Job owner or Admin)
- `DELETE /api/jobs/:id` — Delete job listing (Job owner or Admin)
- `GET /api/jobs/recruiter/my-jobs` — Recruiter's posted jobs with applicant counts
- `PUT /api/jobs/:id/toggle-status` — Toggle job Active/Closed
- `GET /api/jobs/companies/popular` — Top hiring companies directory

### 📝 Applications (`/api/applications`)
- `POST /api/applications` — Submit application with resume & cover letter (Seeker only)
- `GET /api/applications/my-applications` — Seeker's application history
- `GET /api/applications/recruiter` — Recruiter candidate pipeline view
- `GET /api/applications/:id` — Single application details
- `PUT /api/applications/:id/status` — Update candidate stage & notify applicant
- `DELETE /api/applications/:id` — Withdraw application

### 🔖 Saved Jobs (`/api/saved-jobs`)
- `GET /api/saved-jobs` — Fetch current user's bookmarked jobs
- `POST /api/saved-jobs` — Bookmark a job
- `DELETE /api/saved-jobs/:jobId` — Remove bookmark

### 🔔 Notifications (`/api/notifications`)
- `GET /api/notifications` — Fetch user notifications & unread count
- `PUT /api/notifications/:id/read` — Mark notification as read
- `PUT /api/notifications/mark-all-read` — Mark all notifications as read

### 🛡️ Admin & Analytics (`/api/admin`)
- `GET /api/admin/analytics` — Platform metrics & Recharts trends
- `GET /api/admin/jobs` — Moderate all job listings
- `POST /api/admin/reports` — Report a listing
- `GET /api/admin/reports` — Moderation reports queue
- `PUT /api/admin/reports/:id` — Resolve or dismiss report (option to delete job)
- `GET /api/admin/recruiter-analytics` — Recruiter dashboard metrics

---

## 🌐 Deployment Guide

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist IP address (`0.0.0.0/0`).
3. Copy your MongoDB connection URI and set it as `MONGO_URI` in production environment variables.

### 2. Backend (Render / Railway)
1. Push your repository to GitHub.
2. In [Render](https://render.com) or [Railway](https://railway.app), create a new Web Service pointing to `backend/`.
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Configure environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=https://your-frontend-url.vercel.app`).

### 3. Frontend (Vercel / Netlify)
1. In [Vercel](https://vercel.com) or [Netlify](https://netlify.com), import your repository.
2. Set Root Directory to `frontend`.
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Configure Environment Variables:
   - `VITE_API_URL=https://your-backend-url.onrender.com/api`
   - `VITE_BACKEND_URL=https://your-backend-url.onrender.com`
6. Deploy!

---

## 🔒 Security & Best Practices
- **Password Hashing**: Stored passwords are salted and hashed using `bcryptjs` with 10 rounds.
- **JWT Protection**: Secure HTTP Authorization header token exchange with role verification.
- **Access Control**: Users cannot access routes or perform actions outside their permitted role.
- **Input Sanitization**: File uploads are restricted by MIME-type and size limits (10MB for resumes, 5MB for images).
- **Environment Isolation**: No production secrets or database credentials are committed to version control.

---

## 📄 License
This project is open-source under the ISC License.
