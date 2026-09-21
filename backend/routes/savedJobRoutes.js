const express = require('express');
const router = express.Router();
const {
  getSavedJobs,
  saveJob,
  removeSavedJob,
} = require('../controllers/savedJobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Job Seeker'), getSavedJobs);
router.post('/', protect, authorize('Job Seeker'), saveJob);
router.delete('/:jobId', protect, authorize('Job Seeker'), removeSavedJob);

module.exports = router;
