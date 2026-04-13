import express from 'express';
import {
  submitContactForm,
  getAllMessages,
  getMessageById,
  markAsRead,
  deleteMessage,
} from '../controllers/contactController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/send', submitContactForm);

// Protected routes (admin only)
router.get('/all', verifyToken, getAllMessages);
router.get('/:id', verifyToken, getMessageById);
router.put('/:id/read', verifyToken, markAsRead);
router.delete('/:id', verifyToken, deleteMessage);

export default router;
