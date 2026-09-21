const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  toggleJobStatus,
  getTopCompanies,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/companies/popular', getTopCompanies);
router.get('/recruiter/my-jobs', protect, authorize('Recruiter'), getRecruiterJobs);
router.get('/:id', getJobById);

router.post('/', protect, authorize('Recruiter'), createJob);
router.put('/:id', protect, authorize('Recruiter', 'Admin'), updateJob);
router.delete('/:id', protect, authorize('Recruiter', 'Admin'), deleteJob);
router.put('/:id/toggle-status', protect, authorize('Recruiter', 'Admin'), toggleJobStatus);

module.exports = router;
