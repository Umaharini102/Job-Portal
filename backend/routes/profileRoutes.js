const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateJobSeekerProfile,
  updateRecruiterProfile,
  uploadAvatar,
  uploadResume,
  uploadCompanyLogo,
} = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/:id', getProfile);
router.put('/seeker', protect, authorize('Job Seeker'), updateJobSeekerProfile);
router.put('/recruiter', protect, authorize('Recruiter'), updateRecruiterProfile);

router.post(
  '/upload/avatar',
  protect,
  upload.single('profileImage'),
  uploadAvatar
);

router.post(
  '/upload/resume',
  protect,
  authorize('Job Seeker'),
  upload.single('resume'),
  uploadResume
);

router.post(
  '/upload/logo',
  protect,
  authorize('Recruiter'),
  upload.single('companyLogo'),
  uploadCompanyLogo
);

module.exports = router;
