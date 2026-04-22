import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
require('dotenv').config();

// Generate Access Token (short-lived)
const generateAccessToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Generate Refresh Token (long-lived)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate Session ID
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const login = async (req, res, next) => {
  try {
    const inputEmail = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const inputPassword = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    const adminEmail = typeof process.env.ADMIN_EMAIL === 'string' ? process.env.ADMIN_EMAIL.trim() : '';
    const adminPassword = typeof process.env.ADMIN_PASSWORD === 'string' ? process.env.ADMIN_PASSWORD.trim() : '';

    if (process.env.NODE_ENV !== 'production') {
      console.log('[admin login] request email:', inputEmail || 'undefined');
      console.log('[admin login] request password:', inputPassword || 'undefined');
      console.log('[admin login] env ADMIN_EMAIL:', adminEmail || 'undefined');
      console.log('[admin login] env ADMIN_PASSWORD:', adminPassword || 'undefined');
    }

    if (!adminEmail || !adminPassword) {
      console.error('[admin login] ADMIN_EMAIL or ADMIN_PASSWORD is not configured');
      return res.status(500).json({ message: 'Admin credentials are not configured' });
    }

    if (!inputEmail || !inputPassword) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (inputEmail !== adminEmail || inputPassword !== adminPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let user = await User.findOne({ email: adminEmail }).select('+password');

    if (!user) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      user = await User.create({
        email: adminEmail,
        password: hashedPassword,
        fullName: 'Devansh Yadav',
        role: 'admin',
      });
    } else {
      const passwordMatches = user.password ? await bcrypt.compare(adminPassword, user.password) : false;

      if (!passwordMatches) {
        user.password = await bcrypt.hash(adminPassword, 10);
        await user.save();
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email);
    const refreshToken = generateRefreshToken(user._id);
    const sessionId = generateSessionId();

    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || 'Unknown';

    // Create session
    const session = {
      sessionId,
      ipAddress,
      userAgent,
      loginAt: new Date(),
      lastActive: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Update user with refresh token and session
    user.refreshTokens.push({ token: refreshToken });
    user.sessions.push(session);
    user.lastLogin = new Date();
    await user.save();

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      sessionId,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const cookieRefreshToken = req.cookies?.refreshToken;

    const token = refreshToken || cookieRefreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if refresh token is valid
    const tokenExists = user.refreshTokens.some((rt) => rt.token === token);
    if (!tokenExists) {
      return res.status(401).json({ message: 'Refresh token is invalid or expired' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.email);

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove session
    if (sessionId) {
      user.sessions = user.sessions.filter((s) => s.sessionId !== sessionId);
    }

    // Remove refresh token
    if (refreshToken) {
      user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
    }

    await user.save();

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

export const logoutAllSessions = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear all sessions and refresh tokens
    user.sessions = [];
    user.refreshTokens = [];
    await user.save();

    res.clearCookie('refreshToken');

    res.json({ message: 'Logged out from all sessions' });
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('sessions lastLogin');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        lastLogin: user.lastLogin,
        activeSessions: user.sessions.length,
        sessions: user.sessions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default { login, refreshAccessToken, logout, logoutAllSessions, getSessions };
