const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllJobsAdmin,
  getAllRecruitersAdmin,
  getAllApplicationsAdmin,
  getAllCompaniesAdmin,
  createReport,
  getReports,
  updateReportStatus,
  getRecruiterStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/analytics', protect, authorize('Admin'), getAdminStats);
router.get('/jobs', protect, authorize('Admin'), getAllJobsAdmin);
router.get('/recruiters', protect, authorize('Admin'), getAllRecruitersAdmin);
router.get('/applications', protect, authorize('Admin'), getAllApplicationsAdmin);
router.get('/companies', protect, authorize('Admin'), getAllCompaniesAdmin);
router.post('/reports', protect, createReport);
router.get('/reports', protect, authorize('Admin'), getReports);
router.put('/reports/:id', protect, authorize('Admin'), updateReportStatus);
router.get('/recruiter-analytics', protect, authorize('Recruiter'), getRecruiterStats);

module.exports = router;
