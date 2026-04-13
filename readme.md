# Devansh Yadav - Professional Portfolio

A modern, full-stack MERN portfolio website showcasing skills, projects, and experience. Includes a powerful admin dashboard for content management, dynamic content storage, email notifications, and professional animations.

## 🌟 Features

### Public Features
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX** - Dark theme with Navy Blue accents and smooth animations
- **Dynamic Content** - All portfolio content stored in MongoDB and managed via admin panel
- **Project Showcase** - Featured projects with descriptions, tech stack, and live links
- **Skills Section** - Categorized skills (Frontend, Backend, AI/ML, Databases, Tools)
- **Experience Timeline** - Education and professional experience
- **Services Section** - Services offered (Full Stack Dev, UI Design, Freelance)
- **Blog Section** - Article publishing with featured posts
- **Testimonials** - Client/colleague reviews with approval workflow
- **Contact Form** - Email notifications when messages are submitted
- **SEO Optimized** - Meta tags and structured data for search visibility

### Admin Features
- **Authentication** - Secure JWT-based admin login
- **Dashboard** - Overview with statistics and quick actions
- **Content Management** - Full CRUD for all entities (Projects, Skills, Experience, Services, Blog, Testimonials)
- **Message Inbox** - View and manage contact form submissions
- **Blog Management** - Publish/draft articles with featured status

## 🛠️ Tech Stack

### Frontend
- **React** - UI library with Vite for fast development
- **Tailwind CSS** - Modern utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database with schema validation
- **JWT** - Secure authentication
- **Nodemailer** - Email service for contact notifications
- **bcryptjs** - Password hashing

### Deployment
- **Frontend**: Vercel (automatic deployments from GitHub)
- **Backend**: Render / Railway / Heroku
- **Database**: MongoDB Atlas (cloud)
- **Email**: Gmail / SendGrid

## 📋 Project Structure

```
portfolio/
├── backend/                        # Express Backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Skill.js
│   │   ├── Experience.js
│   │   ├── Service.js
│   │   ├── Blog.js
│   │   ├── Testimonial.js
│   │   └── ContactMessage.js
│   ├── routes/                     # API endpoints
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── skills.js
│   │   ├── experience.js
│   │   ├── services.js
│   │   ├── blog.js
│   │   ├── testimonials.js
│   │   └── contact.js
│   ├── controllers/                # Business logic
│   ├── middleware/                 # Auth & error handling
│   ├── utils/                      # Email service
│   ├── .env                        # Environment variables
│   ├── server.js                   # Entry point
│   └── package.json
│
└── frontend/                       # React Frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── common/             # Reusable components
    │   │   └── forms/              # Form components
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── About.jsx
    │   │   ├── Skills.jsx
    │   │   ├── Projects.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Placeholders.jsx
    │   │   └── Admin/
    │   │       ├── Login.jsx
    │   │       └── Dashboard.jsx
    │   ├── services/               # API calls
    │   ├── styles/                 # Global CSS
    │   ├── utils/                  # Helper functions
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env                        # Environment variables
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0 or higher)
- npm or yarn
- Git
- MongoDB (local or MongoDB Atlas account)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/ydevansh/portfolio.git
cd portfolio
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in `/backend` directory:
```
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production

# Email Configuration (Nodemailer - Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourportfolio.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Admin credentials (for first login)
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123
```

**Note for Gmail:** Generate an App Password:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Generate App Password
4. Use this password in EMAIL_PASS

**Note for MongoDB Atlas:**
1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string from Atlas dashboard
3. Replace credentials and add `/portfolio` at the end

Start backend server:
```bash
npm run dev
```

Backend running at `http://localhost:5000`

#### 3. Setup Frontend (in new terminal)

```bash
cd frontend
npm install
```

Create `.env` file in `/frontend` directory:
```
VITE_API_URL=http://localhost:5000/api
```

Start frontend development server:
```bash
npm run dev
```

Frontend running at `http://localhost:5173`

#### 4. Access the application

- **Public Portfolio**: `http://localhost:5173`
- **Admin Login**: `http://localhost:5173/admin/login`
  - Email: `admin@portfolio.com`
  - Password: `Admin@123`

## 📝 API Documentation

### Authentication
```
POST   /api/auth/login              - Admin login
POST   /api/auth/register           - Admin registration
```

### Public Endpoints
```
GET    /api/projects/all            - Get all projects
GET    /api/projects/featured       - Get featured projects
GET    /api/skills/all              - Get all skills
GET    /api/experience/all          - Get all experience
GET    /api/services/all            - Get all services
GET    /api/blog/all                - Get all published blogs
GET    /api/blog/:slug              - Get single blog
GET    /api/testimonials/all        - Get approved testimonials
POST   /api/contact/send            - Submit contact form
```

### Admin Protected Endpoints
```
POST   /api/projects                - Create project
PUT    /api/projects/:id            - Edit project
DELETE /api/projects/:id            - Delete project

POST   /api/skills                  - Create skill
PUT    /api/skills/:id              - Edit skill
DELETE /api/skills/:id              - Delete skill

POST   /api/services                - Create service
PUT    /api/services/:id            - Edit service
DELETE /api/services/:id            - Delete service

POST   /api/blog                    - Create blog
PUT    /api/blog/:id                - Edit blog
DELETE /api/blog/:id                - Delete blog

POST   /api/experience              - Create experience
PUT    /api/experience/:id          - Edit experience
DELETE /api/experience/:id          - Delete experience

PUT    /api/testimonials/approve/:id - Approve testimonial
DELETE /api/testimonials/:id        - Delete testimonial

GET    /api/contact/all             - Get all messages
PUT    /api/contact/:id/read        - Mark message as read
DELETE /api/contact/:id             - Delete message
```

## 📝 Customization

### Update Personal Information
1. **Frontend**: [frontend/src/components/layout/Navbar.jsx](frontend/src/components/layout/Navbar.jsx) - Update social links
2. **Frontend**: [frontend/src/pages/Home.jsx](frontend/src/pages/Home.jsx) - Update hero section
3. **Frontend**: [frontend/src/pages/About.jsx](frontend/src/pages/About.jsx) - Update bio and education
4. **Colors**: [frontend/tailwind.config.js](frontend/tailwind.config.js) - Customize color scheme

### Add Portfolio Content
Use admin panel at `http://localhost:5173/admin/login` to:
- Add projects with images, descriptions, tech stack, and links
- Add skills by category with proficiency levels
- Add work experience and education timeline
- Add services offered
- Write and publish blog articles
- Manage testimonials

### Add Profile Image
1. Generate or upload your profile image
2. Host it on a service (Cloudinary, ImageKit, etc.)
3. Update the image URL in Home.jsx hero section

### Resume Section
1. Host your resume on Google Drive or another service
2. Add the link in the About page
3. Or implement resume upload functionality

## 🌐 Deployment

### Deploy Frontend (Vercel - Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `/client`
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend-api.com/api
     ```
   - Deploy!

### Deploy Backend (Render - Recommended)

1. **Create render.com account** and connect GitHub

2. **Create new Web Service**
   - Connect your repository
   - Set root directory to `/server`
   - Environment: Node
   - Build command: `npm install`
   - Start command: `node server.js`
   - Add environment variables (from .env file)
   - Pre-check MongoDB Atlas is accessible

3. **MongoDB Atlas Setup**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster in a free tier region
   - Add IP address 0.0.0.0/0 to Network Access
   - Get connection string and copy to MONGODB_URI

4. **Deploy!**

### Alternative Backend Hosting
- **Railway**: Similar to Render, easy setup
- **Heroku**: Free tier deprecated, paid plans available
- **Google Cloud Run**: Containerized deployment

### Domain Setup (Optional)
1. Buy domain from GoDaddy, Namecheap, etc.
2. **For Vercel**: Add custom domain in project settings
3. **For Render**: Add custom domain in service settings
4. Update DNS records as instructed by hosting providers

## 📧 Contact

Feel free to reach out:

- **Email**: yaduvanshidevansh3336@gmail.com
- **GitHub**: [github.com/ydevansh](https://github.com/ydevansh)
- **LinkedIn**: [linkedin.com/in/ydevansh](https://www.linkedin.com/in/ydevansh/)
- **Twitter**: [@yxdevansh](https://x.com/yxdevansh)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Next Steps

- [x] Create folder structure
- [x] Setup backend with Express and MongoDB
- [x] Setup frontend with React and Vite
- [ ] Populate portfolio content via admin panel
- [ ] Add profile image and resume
- [ ] Implement additional admin dashboard features
- [ ] Test all API endpoints
- [ ] Deploy to production (Vercel + Render)
- [ ] Setup custom domain
- [ ] Enable analytics
- [ ] Setup CI/CD for automatic deployments

## 📚 Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## ⚠️ Important Notes

1. **Environment Variables**: Never commit `.env` files to GitHub. Use `.env.example` as template.
2. **JWT Secret**: Change `JWT_SECRET` in production to a strong random string.
3. **Email Service**: For production, use SendGrid or other professional email services instead of Gmail.
4. **Database**: Use MongoDB Atlas for production instead of local MongoDB.
5. **CORS**: Update `FRONTEND_URL` in backend for production domain.
6. **Security**: Add rate limiting, input validation, and HTTPS in production.

---

**Last Updated**: April 13, 2026

**Status**: Boilerplate Complete - Ready for Content Population & Deployment

Built with ❤️ by Devansh Yadav
