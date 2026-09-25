import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/protected/ProtectedRoute';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import JobsPage from './pages/public/JobsPage';
import JobDetailsPage from './pages/public/JobDetailsPage';
import CompaniesPage from './pages/public/CompaniesPage';
import CompanyDetailsPage from './pages/public/CompanyDetailsPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Seeker Pages
import SeekerHome from './pages/seeker/SeekerHome';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import ApplicationsPage from './pages/applications/ApplicationsPage';
import SavedJobsPage from './pages/saved/SavedJobsPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobsPage from './pages/recruiter/RecruiterJobsPage';
import PostJobPage from './pages/recruiter/PostJobPage';
import RecruiterApplicantsPage from './pages/recruiter/RecruiterApplicantsPage';
import RecruiterAnalyticsPage from './pages/recruiter/RecruiterAnalyticsPage';
import RecruiterProfilePage from './pages/recruiter/RecruiterProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRecruitersPage from './pages/admin/AdminRecruitersPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// Common Authenticated Pages
import NotificationsPage from './pages/notifications/NotificationsPage';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-charcoal-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/job/:id" element={<JobDetailsPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/company/:id" element={<CompanyDetailsPage />} />

                {/* Job Seeker Protected Routes */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute allowedRoles={['Job Seeker']}>
                      <SeekerHome />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['Job Seeker']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute allowedRoles={['Job Seeker']}>
                      <EditProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute allowedRoles={['Job Seeker']}>
                      <ApplicationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved-jobs"
                  element={
                    <ProtectedRoute allowedRoles={['Job Seeker']}>
                      <SavedJobsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Recruiter Protected Routes */}
                <Route
                  path="/recruiter/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <RecruiterDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/jobs"
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <RecruiterJobsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/post-job"
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <PostJobPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/jobs/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <PostJobPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/applicants"
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <RecruiterApplicantsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <RecruiterAnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/profile"
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <RecruiterProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/recruiters"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminRecruitersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/jobs"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminJobsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/companies"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminCompaniesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/applications"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminApplicationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminAnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Common Protected Routes */}
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute allowedRoles={['Job Seeker', 'Recruiter', 'Admin']}>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={['Job Seeker', 'Recruiter', 'Admin']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
