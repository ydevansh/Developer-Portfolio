# 🚀 Quick Reference - Devansh's Portfolio MERN Stack

## Project Structure at a Glance

```
Developer Portfolio/
├── backend/                   # Express.js Backend
│   ├── models/ (8 files)     → MongoDB schemas
│   ├── controllers/ (8)      → Business logic
│   ├── routes/ (8)           → API endpoints
│   ├── middleware/           → Auth, errors
│   ├── utils/                → Email service
│   ├── config/               → Database connection
│   ├── server.js             → Express entry point
│   └── package.json          → Dependencies
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── pages/ (8)        → Home, About, Projects, Contact, etc.
│   │   ├── services/ (9)     → API calls via Axios
│   │   ├── components/       → Navbar, Footer
│   │   ├── utils/            → Helpers, global CSS
│   │   └── App.jsx           → Router setup
│   ├── index.html
│   ├── vite.config.js        → Build config
│   ├── tailwind.config.js    → Dark Navy Blue theme
│   └── package.json          → Dependencies
│
├── README.md                  → Full documentation
├── SETUP_GUIDE.md            → Quick start + troubleshooting
└── PROJECT_COMPLETION_REPORT.md → Full checklist
```

## Key Files to Know

### Backend
- **backend/server.js** - Main entry point (listen on port 5000)
- **backend/config/db.js** - MongoDB connection
- **backend/middleware/auth.js** - JWT token verification
- **backend/utils/emailService.js** - Nodemailer setup

### Frontend
- **frontend/src/App.jsx** - React Router configuration
- **frontend/src/services/api.js** - Axios with JWT interceptor
- **frontend/src/services/authService.js** - Login/logout logic
- **frontend/tailwind.config.js** - Navy Blue theme customization

## API Routes Overview (27 Endpoints)

### Public (Read-Only)
- `GET /api/projects/all` - All projects
- `GET /api/projects/featured` - Featured only
- `GET /api/skills/all` - All skills  
- `GET /api/blog/all` - All blogs (published)
- `GET /api/contact/send` - Submit contact form
- ...and more

### Protected (Admin Only)
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- ...same pattern for all collections

## Quick Commands

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
cd backend && npm run dev      # Terminal 1 (port 5000)
cd frontend && npm run dev     # Terminal 2 (port 5173)

# Build for production
cd frontend && npm run build
cd backend && npm start
```

## Environment Variables Required

### `/backend/.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

### `/frontend/.env`
```
VITE_API_URL=http://localhost:5000/api
```

## Admin Credentials (For Login)
- **Email**: admin@portfolio.com (set in backend .env)
- **Password**: Set your own in database admin panel
- **Login URL**: http://localhost:5173/admin/login

## Technology Stack Summary

| Layer | Technology | Port |
|-------|-----------|------|
| **Frontend** | React 18 + Vite + Tailwind + Framer Motion | 5173 |
| **Backend** | Express.js + Node.js | 5000 |
| **Database** | MongoDB + Mongoose | 27017 |
| **Auth** | JWT + bcryptjs | - |
| **Email** | Nodemailer + Gmail SMTP | - |

## Deployment Targets

| Service | Platform | Details |
|---------|----------|---------|
| **Frontend** | Vercel | Auto-deploy from GitHub |
| **Backend** | Render | Deploy server with env vars |
| **Database** | MongoDB Atlas | Cloud MongoDB cluster |

## File Type Count

- **Models**: 8 (Mongoose schemas)
- **Controllers**: 8 (CRUD logic)
- **Routes**: 8 (API endpoints)
- **React Pages**: 8 (Public + Admin)
- **Services**: 9 (API calls)
- **Middleware**: 2 (Auth + Error)
- **Configuration**: 7+ (Config files)
- **Documentation**: 3 (README + guides)

## Total Code/Config Files

- **Backend**: 32 files
- **Frontend**: 12+ JSX + 7+ config files
- **Documentation**: 3 files
- **Total**: 50+ files ready to deploy

## Next Steps

1. ✅ **Project scaffolded** (currently here)
2. 📦 **Install dependencies** → `npm install` in server & client
3. ⚙️ **Configure .env files** → Add MongoDB, JWT secret, Gmail
4. 🗄️ **Start MongoDB** → Local or MongoDB Atlas
5. 🚀 **Run dev servers** → `npm run dev` in both folders
6. 📝 **Add portfolio content** → Use admin panel
7. 🧪 **Test API endpoints** → Use Postman or cURL
8. 🌐 **Deploy** → Vercel for frontend, Render for backend

## Debugging Help

### "Cannot find module" error
→ Run `npm install` in the appropriate directory

### "MongoDB connection failed"
→ Check MONGODB_URI in .env or ensure mongod is running

### "Email not sending"
→ Verify EMAIL_USER and EMAIL_PASS in .env, enable Gmail App Password

### "API 404 errors"
→ Check backend is running (`http://localhost:5000`) and VITE_API_URL is correct

### "Admin login fails"
→ Verify JWT_SECRET is set in server .env, check browser console for error

## Support Files

- **README.md** - Full project documentation
- **SETUP_GUIDE.md** - Detailed setup with troubleshooting
- **PROJECT_COMPLETION_REPORT.md** - Complete checklist and verification

---

**Everything is ready! Start with Step 2: Install dependencies.**
