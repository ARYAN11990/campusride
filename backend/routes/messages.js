const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getConversations,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:otherId', protect, getConversation);

module.exports = router;
