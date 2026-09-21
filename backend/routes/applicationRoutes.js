const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Job Seeker'), applyForJob);
router.get('/my-applications', protect, authorize('Job Seeker'), getMyApplications);
router.get('/recruiter', protect, authorize('Recruiter'), getRecruiterApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('Recruiter', 'Admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('Job Seeker'), withdrawApplication);

module.exports = router;
