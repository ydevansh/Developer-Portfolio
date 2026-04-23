import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const normalizeValue = (value) => (typeof value === 'string' ? value.trim() : '');

const isValidBcryptHash = (value) => /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  path: '/api/auth',
});

const getRefreshCookieClearOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth',
});

// Generate Access Token (short-lived)
const generateAccessToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token (long-lived)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

// Generate Session ID
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const login = async (req, res, next) => {
  try {
    const inputEmail = normalizeValue(req.body?.email).toLowerCase();
    const inputPassword = normalizeValue(req.body?.password);
    const adminEmail = normalizeValue(process.env.ADMIN_EMAIL).toLowerCase();
    const adminPasswordHash = normalizeValue(process.env.ADMIN_PASSWORD_HASH);

    if (!adminEmail || !adminPasswordHash) {
      return res.status(500).json({ message: 'Admin credentials are not configured' });
    }

    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      return res.status(500).json({ message: 'Token secrets are not configured' });
    }

    if (!isValidBcryptHash(adminPasswordHash)) {
      return res.status(500).json({ message: 'Admin password hash is invalid' });
    }

    if (!inputEmail || !inputPassword) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const passwordMatches = await bcrypt.compare(inputPassword, adminPasswordHash);

    if (inputEmail !== adminEmail || !passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let user = await User.findOne({ email: adminEmail }).select('+password');

    if (!user) {
      user = await User.create({
        email: adminEmail,
        password: adminPasswordHash,
        fullName: 'Devansh Yadav',
        role: 'admin',
      });
    } else if (user.password !== adminPasswordHash) {
      user.password = adminPasswordHash;
      await user.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email);
    const refreshToken = generateRefreshToken(user._id);
    const refreshTokenHash = hashToken(refreshToken);
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
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_COOKIE_MAX_AGE_MS),
    };

    // Update user with refresh token and session
    user.refreshTokens.push({ token: refreshTokenHash });
    user.sessions.push(session);
    user.lastLogin = new Date();
    await user.save();

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    res.json({
      message: 'Login successful',
      accessToken,
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
    const bodyRefreshToken = normalizeValue(req.body?.refreshToken);
    const cookieRefreshToken = normalizeValue(req.cookies?.refreshToken);
    const token = bodyRefreshToken || cookieRefreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
      return res.status(500).json({ message: 'Token secret is not configured' });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if refresh token is valid
    const tokenHash = hashToken(token);
    const tokenExists = user.refreshTokens.some(
      (rt) => rt.token === tokenHash || rt.token === token
    );
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
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Refresh token is invalid' });
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const sessionId = normalizeValue(req.body?.sessionId);
    const bodyRefreshToken = normalizeValue(req.body?.refreshToken);
    const cookieRefreshToken = normalizeValue(req.cookies?.refreshToken);
    const refreshToken = bodyRefreshToken || cookieRefreshToken;
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
      const refreshTokenHash = hashToken(refreshToken);
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== refreshTokenHash && rt.token !== refreshToken
      );
    }

    await user.save();

    // Clear refresh token cookie
    res.clearCookie('refreshToken', getRefreshCookieClearOptions());

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

    res.clearCookie('refreshToken', getRefreshCookieClearOptions());

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
