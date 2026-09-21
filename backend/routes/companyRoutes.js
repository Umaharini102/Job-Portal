const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getPopularCompanies,
  getCompanyById,
  getCompanyJobs,
  createCompany,
  updateCompany,
  toggleVerifyCompany,
  deleteCompany,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCompanies);
router.get('/popular', getPopularCompanies);
router.get('/:id', getCompanyById);
router.get('/:id/jobs', getCompanyJobs);

// Protected routes
router.post('/', protect, authorize('Recruiter', 'Admin'), createCompany);
router.put('/:id', protect, authorize('Admin'), updateCompany);
router.put('/:id/verify', protect, authorize('Admin'), toggleVerifyCompany);
router.delete('/:id', protect, authorize('Admin'), deleteCompany);

module.exports = router;
