const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Admin'), getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('Admin'), deleteUser);
router.put('/:id/toggle-status', protect, authorize('Admin'), toggleUserStatus);

module.exports = router;
