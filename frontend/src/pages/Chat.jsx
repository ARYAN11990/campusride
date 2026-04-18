import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAvatarColor } from '../utils/helpers';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedUserRef = useRef(null);

  // Keep a ref in-sync so socket callbacks always read the latest selectedUser
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // If userId param is present (navigating from ride page), open that chat
  useEffect(() => {
    if (userId && conversations.length >= 0) {
      // Set a temporary selectedUser so chat area opens immediately
      setSelectedUser({ _id: userId, name: '...' });
      fetchMessages(userId);
    }
  }, [userId]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const current = selectedUserRef.current;
      if (current) {
        const senderId = message.sender?._id || message.sender;
        if (senderId === current._id || senderId === user._id) {
          setMessages((prev) => {
            // Avoid duplicates (if API + socket both fire)
            if (prev.some((m) => m._id === message._id)) return prev;
            return [...prev, message];
          });
        }
      }
      fetchConversations();
    };

    const handleMessageSent = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      fetchConversations();
    };

    const handleTyping = ({ userId: typingUserId }) => {
      const current = selectedUserRef.current;
      if (current && typingUserId === current._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ userId: typingUserId }) => {
      const current = selectedUserRef.current;
      if (current && typingUserId === current._id) {
        setIsTyping(false);
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageSent', handleMessageSent);
    socket.on('userTyping', handleTyping);
    socket.on('userStopTyping', handleStopTyping);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageSent', handleMessageSent);
      socket.off('userTyping', handleTyping);
      socket.off('userStopTyping', handleStopTyping);
    };
  }, [socket, user]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/messages/conversations');
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConvos(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    setLoadingMsgs(true);
    try {
      const { data } = await API.get(`/messages/${otherUserId}`);
      setMessages(data);

      // Resolve the other user's full info
      const convo = conversations.find((c) => c.otherUser?._id === otherUserId);
      if (convo) {
        setSelectedUser(convo.otherUser);
      } else if (data.length > 0) {
        const senderId = data[0].sender?._id || data[0].sender;
        const other = senderId === user._id ? data[0].receiver : data[0].sender;
        setSelectedUser(other);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || sendingMsg) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSendingMsg(true);

    try {
      if (socket) {
        // Send via socket for real-time delivery and DB persistence
        socket.emit('sendMessage', {
          senderId: user._id,
          receiverId: selectedUser._id,
          content,
        });
        
        socket.emit('stopTyping', {
          senderId: user._id,
          receiverId: selectedUser._id,
        });
        
        // Note: messageSent listener handles adding message to state and un-setting sendingMsg
      } else {
        // Fallback to API
        const { data } = await API.post('/messages', {
          receiverId: selectedUser._id,
          content,
        });

        setMessages((prev) => {
          if (prev.some((m) => m._id === data._id)) return prev;
          return [...prev, data];
        });
      }

      fetchConversations();
    } catch (err) {
      console.error('Send message error:', err);
      // Restore the typed message so user can retry
      setNewMessage(content);
    } finally {
      if (!socket) {
        setSendingMsg(false);
      } else {
        // A short timeout to unset sendingMsg if we use socket, or wait for socket listener
        setTimeout(() => setSendingMsg(false), 300);
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (socket && selectedUser) {
      socket.emit('typing', {
        senderId: user._id,
        receiverId: selectedUser._id,
      });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', {
          senderId: user._id,
          receiverId: selectedUser._id,
        });
      }, 1000);
    }
  };

  const selectConversation = (otherUser) => {
    setSelectedUser(otherUser);
    setMessages([]);
    fetchMessages(otherUser._id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>

      <div className="glass rounded-2xl overflow-hidden flex flex-col md:flex-row" style={{ height: '70vh' }}>
        {/* Conversations List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col" style={{ maxHeight: '30vh', minHeight: '30vh' }}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-700">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvos ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((convo) => (
                <button
                  key={convo.conversationId}
                  onClick={() => selectConversation(convo.otherUser)}
                  className={`w-full text-left p-4 flex items-center gap-3 hover:bg-white transition-colors border-b border-gray-100 ${
                    selectedUser?._id === convo.otherUser?._id ? 'bg-gray-50 border-l-2 border-l-primary-500' : ''
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 text-sm font-bold flex-shrink-0"
                    style={getAvatarColor(convo.otherUser?.name)}
                  >
                    {convo.otherUser?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-medium truncate">{convo.otherUser?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{convo.lastMessage}</p>
                  </div>
                  {convo.unreadCount > 0 && (
                    <span className="w-5 h-5 text-white text-xs flex items-center justify-center flex-shrink-0">
                      {convo.unreadCount}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-10 px-4">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm font-medium">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">Start chatting from a ride page</p>
                <Link
                  to="/search"
                  className="inline-block text-xs px-4 py-2 rounded-lg bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 transition-colors font-medium"
                >
                  Browse Rides
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
                {/* Back button on mobile */}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden p-1 text-gray-500 hover:text-gray-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div
                  className="-white text-sm font-bold"
                  style={getAvatarColor(selectedUser.name)}
                >
                  {selectedUser.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-800 font-medium text-sm">{selectedUser.name}</p>
                  {isTyping && <p className="text-xs text-blue-600">typing...</p>}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => {
                    const senderId = msg.sender?._id || msg.sender;
                    const isMine = senderId === user._id;
                    return (
                      <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMine
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }`}>
                          <p className="break-words">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 text-sm">No messages yet. Say hello! 👋</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-slate-500 focus:border-blue-500 focus:ring-0"
                    placeholder="Type a message..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMsg}
                    className="px-5 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium btn-transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {sendingMsg ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center mx-auto mb-6 border border-gray-100">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h3>
                <p className="text-gray-500 text-sm mb-6">Choose someone from the sidebar, or find a ride to start a new chat.</p>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold btn-transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Rides to Start a Chat
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
