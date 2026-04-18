const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  uploadPhoto,
  deleteAccount,
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All profile routes require authentication
router.use(protect);

router.route('/').get(getProfile).put(updateProfile).delete(deleteAccount);
router.put('/password', changePassword);
router.put('/photo', upload.single('profilePhoto'), uploadPhoto);

module.exports = router;
