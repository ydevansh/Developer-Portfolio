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

const normalizeOrigin = (origin) => {
  const value = (origin || '').trim();

  if (!value) {
    return '';
  }

  try {
    return new URL(value).origin.toLowerCase();
  } catch {
    return value.replace(/\/+$/, '').toLowerCase();
  }
};

const DEFAULT_FRONTEND_ORIGINS = ['http://localhost:5173'];

const parseAllowedOrigins = () => {
  const configuredOrigins = `${process.env.FRONTEND_URL || ''},${process.env.CORS_ORIGINS || ''}`
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

  const fallbackOrigins = DEFAULT_FRONTEND_ORIGINS.map(normalizeOrigin);
  return configuredOrigins.length > 0 ? configuredOrigins : fallbackOrigins;
};

const allowedOrigins = new Set(parseAllowedOrigins());
const allowVercelPreviewOrigins = process.env.ALLOW_VERCEL_PREVIEWS === 'true';
const vercelPreviewOriginPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

const isAllowedOrigin = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);

  if (allowedOrigins.has(normalizedOrigin)) {
    return true;
  }

  if (allowVercelPreviewOrigins && vercelPreviewOriginPattern.test(normalizedOrigin)) {
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

    console.warn(`⛔ CORS blocked origin: ${origin}`);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Portfolio API is live',
    health: '/health',
    timestamp: new Date(),
  });
});

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
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`🌐 Allowed frontend origins: ${Array.from(allowedOrigins).join(', ')}`);
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
  } catch (error) {
    console.error(`❌ Startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export default app;
