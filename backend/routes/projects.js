import express from 'express';
import {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/all', getAllProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProjectById);

// Protected routes (admin only)
router.post('/', verifyToken, createProject);
router.put('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;
