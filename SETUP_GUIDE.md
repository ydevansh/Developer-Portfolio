# 🚀 Quick Start Guide - Devansh Yadav's Portfolio

## ⚡ 5-Minute Quick Start

### 1. Install Dependencies

**Backend Terminal:**
```bash
cd backend
npm install
```

**Frontend Terminal (new terminal):**
```bash
cd frontend
npm install
```

### 2. Create Environment Files

**Create `/backend/.env`:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_secret_key_here_change_in_production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourportfolio.com
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123
```

**Create `/frontend/.env`:**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string
- Replace `MONGODB_URI` in `/backend/.env`

### 4. Run the Application

**Backend (terminal 1):**
```bash
cd backend
npm run dev
```
✅ Backend running at: http://localhost:5000

**Frontend (terminal 2):**
```bash
cd frontend
npm run dev
```
✅ Frontend running at: http://localhost:5173

### 5. Access Your Portfolio

- **Public Portfolio**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
  - Email: `admin@portfolio.com`
  - Password: `Admin@123`

---

## 📚 Detailed Setup

### Prerequisites Installation

**Windows:**
1. Download [Node.js](https://nodejs.org) (v16+)
2. Download [MongoDB Community](https://www.mongodb.com/try/download/community) or use MongoDB Atlas

**Mac:**
```bash
brew install node
brew install mongodb-community
```

**Linux (Ubuntu):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb
```

### Verify Installation

```bash
node --version    # Should show v16.0.0 or higher
npm --version     # Should show 8.0.0 or higher
```

---

## 💻 Project Structure Overview

```
portfolio/
├── backend/             # Express backend
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── controllers/     # Business logic
│   ├── server.js        # Main entry
│   └── .env
│
└── frontend/            # React frontend
    ├── src/
    │   ├── pages/       # Page components
    │   ├── components/  # Reusable components
    │   └── services/    # API calls
    └── .env
```

---

## 🔧 Useful Commands

### Backend Commands
```bash
cd backend
npm run dev                # Development (with hot reload)
npm start                  # Production
npm run dev -- --port 3001 # Run on different port
```

### Frontend Commands
```bash
cd frontend
npm run dev                # Development server
npm run build              # Build for production
npm run preview            # Preview production build
```

---

## 🗄️ Database Setup

### Local MongoDB

1. **Start MongoDB service:**
   ```bash
   # Windows
   mongod.exe
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Verify connection:**
   ```bash
   mongosh
   ```

### MongoDB Atlas (Cloud - Recommended)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add your IP to Network Access (0.0.0.0/0 for development)
4. Create database user with password
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   ```
6. Update `MONGODB_URI` in `/backend/.env`

---

## 📧 Email Setup

### Gmail (App Password)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Generate App Password
4. Copy generated password
5. Update `EMAIL_PASS` in `/backend/.env`

### Alternative: SendGrid
1. Sign up at [SendGrid](https://sendgrid.com)
2. Get API key
3. Update email service in `/backend/utils/emailService.js`

---

## 📁 Adding Your Content

After initial setup, add content via admin panel:

1. **Login**: http://localhost:5173/admin/login
2. **Add Projects**: Click "Projects" → Add your featured projects
3. **Add Skills**: Click "Skills" → Add skills by category
4. **Add Experience**: Click "Experience" → Add education/work
5. **Add Services**: Click "Services" → Add services offered
6. **Write Blog**: Click "Blog" → Write articles
7. **Manage Testimonials**: Click "Testimonials" → Approve/manage reviews

---

## 🔍 Testing API Endpoints

### Using Postman or REST Client

**Login (Get Token):**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@portfolio.com",
  "password": "Admin@123"
}
```

**Get All Projects:**
```
GET http://localhost:5000/api/projects/all
```

**Submit Contact Form:**
```
POST http://localhost:5000/api/contact/send
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Hello, I'm interested..."
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error
- Ensure MongoDB is running: `mongostat`
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### Email Not Sending
- Check email credentials in `.env`
- Enable "Less secure app access" if using Gmail
- Verify SMTP settings

### Cannot Access Admin Panel
- Clear browser cookies
- Check backend is running
- Verify `.env` files are set correctly
- Check browser console for errors

---

## 📖 Documentation

- [Backend API Docs](./backend/README.md) (if exists)
- [Frontend Setup](./frontend/README.md) (if exists)
- Main [README.md](./README.md)

---

## ✅ Development Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB running locally or MongoDB Atlas connected
- [ ] `/backend/.env` created and configured
- [ ] `/frontend/.env` created and configured
- [ ] Backend dependencies installed (`npm install` in `/server`)
- [ ] Frontend dependencies installed (`npm install` in `/client`)
- [ ] Backend running (`npm run dev` in `/server`)
- [ ] Frontend running (`npm run dev` in `/client`)
- [ ] Can access http://localhost:5173
- [ ] Can login to admin at http://localhost:5173/admin/login
- [ ] Can add content via admin panel

---

## 🚀 Ready for Production?

After completing development:

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Test Production Build:**
   ```bash
   npm run preview
   ```

3. **Deploy to Vercel** (Frontend)
4. **Deploy to Render** (Backend)
5. **Set custom domain** (Optional)

---

## 📞 Support

For issues or questions:
- Check troubleshooting section above
- Review error messages in console
- Check database connection
- Verify environment variables

---

**Happy Building! 🎉**

For detailed deployment instructions, see [README.md](./README.md#-deployment)
