import express from 'express';
import {
  getAllExperience,
  getExperienceByType,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/all', getAllExperience);
router.get('/type/:type', getExperienceByType);

// Protected routes (admin only)
router.post('/', verifyToken, createExperience);
router.put('/:id', verifyToken, updateExperience);
router.delete('/:id', verifyToken, deleteExperience);

export default router;
