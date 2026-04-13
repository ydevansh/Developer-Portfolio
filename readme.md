# Professional Portfolio Website

A modern, responsive portfolio website showcasing my skills, projects, and experience as a developer. This portfolio is designed to leave a lasting impression on potential employers and clients.

## 🌟 Features

- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean and professional interface with smooth animations
- **Project Showcase** - Highlighted projects with descriptions and live links
- **About Section** - Professional bio and skill highlights
- **Contact Form** - Easy way for visitors to reach out
- **Dark/Light Mode** - Toggle between themes for better user experience
- **SEO Optimized** - Meta tags and structured data for better search visibility
- **Fast Performance** - Optimized assets and lazy loading

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building interactive components
- **CSS3 / Tailwind CSS** - Styling and responsive design
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Tools & Services
- **Git** - Version control
- **npm** - Package manager
- **Postman** - API testing (development)
- **Hosting**: Vercel (Frontend) / Render / Heroku (Backend)

## 📋 Project Structure

```
portfolio/
├── client/                 # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS/Tailwind styles
│   │   ├── services/       # API calls with axios
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express Backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   ├── .env                # Environment variables
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0 or higher)
- npm or yarn
- Git
- MongoDB (local or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   NODE_ENV=development
   ```
   Start backend server:
   ```bash
   npm run dev
   ```

3. **Setup Frontend** (in new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Open in browser**
   - Frontend: `http://localhost:5173` (Vite)
   - Backend API: `http://localhost:5000`

## 📝 Customization

Update the following files with your information:

- **Personal Info**: Edit `index.html` - Update name, title, and bio
- **Projects**: Add your projects in the projects section with descriptions and links
- **Colors**: Modify CSS variables in `css/styles.css`
- **Contact**: Update the contact form with your email/preferred contact method
- **Icons**: Replace social media links with your profiles

## 🌐 Deployment

### Option 1: Vercel
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
- Connect your Git repository to Netlify dashboard
- Auto-deploy on every push to main branch

### Option 3: GitHub Pages
```bash
git push origin main
```
Enable GitHub Pages in repository settings pointing to main branch

### Option 4: Traditional Hosting
1. Build/prepare your files
2. Upload via FTP or file manager to your hosting provider
3. Point domain to your hosting

## 📧 Contact

Feel free to reach out to me:

- **Email**: your-email@example.com
- **LinkedIn**: [linkedin.com/in/your-profile](https://linkedin.com)
- **GitHub**: [github.com/your-username](https://github.com)
- **Twitter**: [@your-handle](https://twitter.com)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Last Updated**: April 2026

**Status**: Active Development
