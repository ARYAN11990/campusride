const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  getUsers,
  deleteUser,
  getAllRides,
  deleteRide,
  getStats,
} = require('../controllers/adminController');

// Admin Auth Middleware
const adminAuth = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.isAdmin) {
        next();
      } else {
        return res.status(403).json({ message: 'Not authorized as admin' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@campusride.com' && password === 'admin123') {
    const token = jwt.sign({ isAdmin: true, email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token, email });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// Protect all following routes with adminAuth
router.use(adminAuth);

router.get('/stats', getStats);
router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/rides').get(getAllRides);
router.route('/rides/:id').delete(deleteRide);

module.exports = router;
