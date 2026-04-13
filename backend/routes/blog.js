import express from 'express';
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/all', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Protected routes (admin only)
router.post('/', verifyToken, createBlog);
router.put('/:id', verifyToken, updateBlog);
router.delete('/:id', verifyToken, deleteBlog);

export default router;
