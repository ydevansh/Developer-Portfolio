import express from 'express';
import {
  getAllTestimonials,
  createTestimonial,
  approveTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/all', getAllTestimonials);
router.post('/', createTestimonial);

// Protected routes (admin only)
router.put('/approve/:id', verifyToken, approveTestimonial);
router.put('/:id', verifyToken, updateTestimonial);
router.delete('/:id', verifyToken, deleteTestimonial);

export default router;
