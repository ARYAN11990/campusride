const Message = require('../models/Message');

const setupSocket = (io) => {
  // Track online users: { userId: socketId }
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register user when they come online
    socket.on('register', (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle sending a message
    socket.on('sendMessage', async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        const conversationId = [senderId, receiverId].sort().join('_');

        // Save message to database
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          content,
          conversationId,
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name email')
          .populate('receiver', 'name email');

        // Send to receiver if online
        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit('newMessage', populatedMessage);
        }

        // Send back to sender for confirmation
        socket.emit('messageSent', populatedMessage);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ senderId, receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit('userTyping', { userId: senderId });
      }
    });

    socket.on('stopTyping', ({ senderId, receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit('userStopTyping', { userId: senderId });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      // Remove user from online users
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

module.exports = setupSocket;
