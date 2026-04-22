import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaEye, FaEnvelope, FaCheck } from 'react-icons/fa';
import Card from '../../components/admin/Card';
import contactService from '../../services/contactService';
import { truncateText } from '../../utils/helpers';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAllMessages();
      const data = response.data.data || [];
      setMessages(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        unread: data.filter((m) => !m.read).length,
        read: data.filter((m) => m.read).length,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (message) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactService.deleteMessage(message._id);
        const updatedMessages = messages.filter((m) => m._id !== message._id);
        setMessages(updatedMessages);
        setSelectedMessage(null);
        setStats({
          total: updatedMessages.length,
          unread: updatedMessages.filter((m) => !m.read).length,
          read: updatedMessages.filter((m) => m.read).length,
        });
      } catch (err) {
        console.error('Error deleting message:', err);
      }
    }
  };

  const handleMarkAsRead = async (message) => {
    if (message.read) {
      return;
    }

    try {
      const response = await contactService.markMessageAsRead(message._id);
      const updatedMessage = response.data.data;

      const updatedMessages = messages.map((item) =>
        item._id === updatedMessage._id ? updatedMessage : item
      );

      setMessages(updatedMessages);
      setStats({
        total: updatedMessages.length,
        unread: updatedMessages.filter((item) => !item.read).length,
        read: updatedMessages.filter((item) => item.read).length,
      });

      setSelectedMessage((currentSelected) =>
        currentSelected && currentSelected._id === updatedMessage._id ? updatedMessage : currentSelected
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError(err.response?.data?.message || 'Failed to mark message as read');
    }
  };

  const handleView = (message) => {
    setSelectedMessage(message);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-400 mt-1">Manage contact form submissions</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-gray-400">Total Messages</p>
          <p className="text-2xl font-bold mt-2">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-gray-400">Unread</p>
          <p className="text-2xl font-bold mt-2 text-red-400">{stats.unread}</p>
        </Card>
        <Card>
          <p className="text-gray-400">Read</p>
          <p className="text-2xl font-bold mt-2 text-green-400">{stats.read}</p>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FaEnvelope size={32} className="mx-auto mb-4 opacity-50" />
            <p>No messages yet. Your contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-500/20">
                  <th className="text-left py-4 px-6 font-semibold text-gray-400 text-sm">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-400 text-sm">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-400 text-sm">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-400 text-sm">Message</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-400 text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-400 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <motion.tr
                    key={msg._id}
                    whileHover={{ backgroundColor: 'rgba(79, 39, 245, 0.05)' }}
                    className={`border-b border-primary-500/10 hover:bg-primary-500/5 transition-colors ${
                      !msg.read ? 'bg-primary-500/5' : ''
                    }`}
                  >
                    <td className="py-4 px-6 text-sm text-gray-300 font-medium">{msg.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-400">{msg.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-400">{formatDate(msg.createdAt)}</td>
                    <td className="py-4 px-6 text-sm text-gray-300">{truncateText(msg.message, 90)}</td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          msg.read
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {msg.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleView(msg)}
                          className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs transition-all flex items-center space-x-1"
                        >
                          <FaEye size={12} />
                          <span>View</span>
                        </button>
                        {!msg.read ? (
                          <button
                            onClick={() => handleMarkAsRead(msg)}
                            className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs transition-all flex items-center space-x-1"
                          >
                            <FaCheck size={12} />
                            <span>Mark as Read</span>
                          </button>
                        ) : (
                          <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-medium">
                            Read
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(msg)}
                          className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-all flex items-center space-x-1"
                        >
                          <FaTrash size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
          onClick={() => setSelectedMessage(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-primary-900 border border-primary-500/20 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">{selectedMessage.name}</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-500 text-xs">Email</p>
                <p className="text-gray-300">{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Date</p>
                <p className="text-gray-300">{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    selectedMessage.read
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {selectedMessage.read ? 'Read' : 'Unread'}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-2">Message</p>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedMessage.message}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!selectedMessage.read && (
                <button
                  onClick={() => handleMarkAsRead(selectedMessage)}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 rounded-lg text-sm font-medium transition-colors"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedMessage)}
                className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg text-sm font-medium transition-colors"
              >
                Delete Message
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
