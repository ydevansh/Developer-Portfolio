import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import skillRoutes from './routes/skills.js';
import experienceRoutes from './routes/experience.js';
import serviceRoutes from './routes/services.js';
import blogRoutes from './routes/blog.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contact.js';
import dashboardRoutes from './routes/dashboard.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const DEFAULT_FRONTEND_ORIGINS = ['http://localhost:5173'];

const parseAllowedOrigins = () => {
  const configuredOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins.length > 0 ? configuredOrigins : DEFAULT_FRONTEND_ORIGINS;
};

const allowedOrigins = parseAllowedOrigins();
const allowVercelPreviewOrigins = process.env.ALLOW_VERCEL_PREVIEWS === 'true';
const vercelPreviewOriginPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

const isAllowedOrigin = (origin) => {
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  if (allowVercelPreviewOrigins && vercelPreviewOriginPattern.test(origin)) {
    return true;
  }

  return false;
};

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (health checks, curl) that do not send Origin.
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Allowed frontend origins: ${allowedOrigins.join(', ')}`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST   /api/auth/login                 - Admin login`);
  console.log(`   GET    /api/projects/all              - Get all projects`);
  console.log(`   GET    /api/skills/all                - Get all skills`);
  console.log(`   GET    /api/experience/all            - Get all experience`);
  console.log(`   GET    /api/services/all              - Get all services`);
  console.log(`   GET    /api/blog/all                  - Get all blogs`);
  console.log(`   GET    /api/testimonials/all          - Get all testimonials`);
  console.log(`   POST   /api/contact                   - Submit contact form`);
});

export default app;
