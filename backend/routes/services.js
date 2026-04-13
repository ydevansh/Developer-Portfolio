import express from 'express';
import {
  getAllServices,
  getFeaturedServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/all', getAllServices);
router.get('/featured', getFeaturedServices);

// Protected routes (admin only)
router.post('/', verifyToken, createService);
router.put('/:id', verifyToken, updateService);
router.delete('/:id', verifyToken, deleteService);

export default router;
