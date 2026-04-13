import express from 'express';
import {
  getAllSkills,
  getSkillsByCategory,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/all', getAllSkills);
router.get('/category/:category', getSkillsByCategory);

// Protected routes (admin only)
router.post('/', verifyToken, createSkill);
router.put('/:id', verifyToken, updateSkill);
router.delete('/:id', verifyToken, deleteSkill);

export default router;
