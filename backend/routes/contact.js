import express from 'express';
import { body } from 'express-validator';
import {
  deleteMessage,
  getAllMessages,
  getMessageById,
  submitContactForm,
} from '../controllers/contactController.js';
import verifyToken from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required'),
];

router.post('/', contactValidation, validateRequest, submitContactForm);

// Keep the legacy path working while the frontend moves to /api/contact.
router.post('/send', contactValidation, validateRequest, submitContactForm);

router.get('/all', verifyToken, getAllMessages);
router.get('/:id', verifyToken, getMessageById);
router.delete('/:id', verifyToken, deleteMessage);

export default router;
