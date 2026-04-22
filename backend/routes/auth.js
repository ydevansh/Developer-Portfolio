import express from 'express';
import { login, refreshAccessToken, logout, logoutAllSessions, getSessions } from '../controllers/authController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', verifyToken, logout);
router.post('/logout-all', verifyToken, logoutAllSessions);
router.get('/sessions', verifyToken, getSessions);

export default router;
