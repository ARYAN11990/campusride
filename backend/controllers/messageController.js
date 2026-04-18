const Message = require('../models/Message');
const User = require('../models/User');

// Helper to generate a consistent conversation ID between two users
const getConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

// @desc    Send a message
// @route   POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const conversationId = getConversationId(senderId.toString(), receiverId);

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      conversationId,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:oderId
exports.getConversation = async (req, res) => {
  try {
    const otherId = req.params.otherId;
    const conversationId = getConversationId(req.user._id.toString(), otherId);

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for the current user
// @route   GET /api/messages/conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all unique conversations this user is part of
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$content' },
          lastMessageAt: { $first: '$createdAt' },
          sender: { $first: '$sender' },
          receiver: { $first: '$receiver' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$read', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    // Populate the other user's info
    const conversations = await Promise.all(
      messages.map(async (msg) => {
        const otherUserId = msg.sender.toString() === userId.toString() ? msg.receiver : msg.sender;
        const otherUser = await User.findById(otherUserId).select('name email');
        return {
          conversationId: msg._id,
          otherUser,
          lastMessage: msg.lastMessage,
          lastMessageAt: msg.lastMessageAt,
          unreadCount: msg.unreadCount,
        };
      })
    );

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
