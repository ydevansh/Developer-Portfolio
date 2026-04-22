# Complete Admin Portal Setup Guide

## 🎯 Overview

A fully functional admin portal with:
- ✅ JWT Authentication (Access Token + Refresh Token)
- ✅ Session Management (Track multiple sessions)
- ✅ Admin Credentials (devansh@gmail.com / gaurav@dev)
- ✅ Contact Message Management with Real Database
- ✅ Auto Token Refresh
- ✅ Proper Logout (Single & All Sessions)

---

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install `cookie-parser` which is needed for refresh tokens.

### 2. Initialize Admin User

Create the admin user in MongoDB:

```bash
npm run init-admin
```

**Output:**
```
📝 Connected to MongoDB
✅ Admin user created successfully
   Email: devansh@gmail.com
   Name: Devansh Yadav
   Password: gaurav@dev
```

### 3. Start Backend Server

```bash
npm run dev
```

**Expected Output:**
```
✅ Server running on http://localhost:5000
MongoDB connected successfully
📝 API Documentation:
   POST   /api/auth/login                 - Admin login
   POST   /api/auth/refresh               - Refresh access token
   POST   /api/auth/logout                - Logout current session
   POST   /api/auth/logout-all            - Logout all sessions
   GET    /api/auth/sessions              - Get active sessions
   GET    /api/contact/all                - Get all messages
   DELETE /api/contact/:id                - Delete message
```

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

### 5. Access Admin Portal

- **URL:** http://localhost:5173/admin/login
- **Email:** `devansh@gmail.com`
- **Password:** `gaurav@dev`

---

## 🔐 Authentication Flow

### Login Process

1. User enters email & password
2. Backend verifies credentials
3. Server returns:
   - `accessToken` (1-hour expiry)
   - `refreshToken` (7-day expiry in HTTP-only cookie)
   - `sessionId` (for tracking)
   - `user` info

4. Frontend stores tokens in localStorage
5. User redirected to dashboard

### Token Refresh

When access token expires:

1. Frontend automatically uses refresh token
2. Backend validates refresh token
3. Returns new access token
4. Request is retried automatically
5. No manual re-login needed

### Logout

**Single Session:**
```javascript
await authService.logout();
```

**All Sessions:**
```javascript
await authService.logoutAll();
```

---

## 📋 API Endpoints

### Authentication

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "devansh@gmail.com",
  "password": "gaurav@dev"
}

Response:
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "sessionId": "a1b2c3d4...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "email": "devansh@gmail.com",
    "fullName": "Devansh Yadav"
  }
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "sessionId": "a1b2c3d4...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response:
{
  "message": "Logout successful"
}
```

#### Logout All Sessions
```
POST /api/auth/logout-all
Authorization: Bearer <accessToken>

Response:
{
  "message": "Logged out from all sessions"
}
```

#### Get Active Sessions
```
GET /api/auth/sessions
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "data": {
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "activeSessions": 2,
    "sessions": [
      {
        "sessionId": "a1b2c3d4...",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "loginAt": "2024-01-15T10:30:00.000Z",
        "lastActive": "2024-01-15T10:35:00.000Z",
        "expiresAt": "2024-01-22T10:30:00.000Z"
      }
    ]
  }
}
```

### Contact Messages

#### Get All Messages
```
GET /api/contact/all
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "message": "Messages fetched successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Great portfolio!",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Delete Message
```
DELETE /api/contact/:id
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## 🎨 Admin Panel Pages

### 1. Dashboard
- Welcome message
- 3 statistics cards (Projects, Blogs, Messages)
- Recent activity feed

### 2. Projects
- View all projects
- Add/Edit/Delete projects
- Form fields: Title, Description, Tech Stack, Image URL, GitHub Link, Live Link

### 3. Blogs
- Manage blog posts
- Add/Edit/Delete functionality
- Form fields: Title, Content, Category, Image URL, Read Time

### 4. Messages ✨ (Real Data)
- View all contact form submissions
- See sender name, email, message, date
- Statistics (Total, Unread, Read)
- Delete messages
- View detailed messages in modal

### 5. Skills
- Manage skills by category
- Categories: Frontend, Backend, AI/Core
- Add/Delete skills

### 6. Settings
- Update profile information
- Change password
- Resume upload UI
- Account deletion (danger zone)

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://yaduvanshidevansh3336_db_user:frCLN5XKRWkSifjp@cluster0.3tubw8e.mongodb.net/?appName=Cluster0

# JWT & Session
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_2024
SESSION_SECRET=your_super_secret_session_key_2024

# Admin Credentials
ADMIN_EMAIL=devansh@gmail.com
ADMIN_PASSWORD=gaurav@dev

# Frontend
FRONTEND_URL=http://localhost:5173

# Email
EMAIL_USER=yaduvanshidevansh3336@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM=noreply@portfolio.com
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔄 Token Management (Frontend)

### localStorage Keys
```javascript
localStorage.getItem('accessToken')      // Short-lived token
localStorage.getItem('refreshToken')     // Long-lived token
localStorage.getItem('sessionId')        // Session identifier
localStorage.getItem('user')             // User info (JSON)
```

### Auth Service Usage

```javascript
import authService from '@/services/authService';

// Login
const response = await authService.login('devansh@gmail.com', 'gaurav@dev');

// Get current token
const token = authService.getAccessToken();

// Check if authenticated
if (authService.isAuthenticated()) {
  // User is logged in
}

// Get user info
const user = authService.getUser();

// Logout
await authService.logout();

// Logout all sessions
await authService.logoutAll();

// Get active sessions
const sessions = await authService.getSessions();
```

---

## 🛡️ Security Features

1. **JWT Tokens:**
   - Access tokens expire in 1 hour
   - Refresh tokens expire in 7 days
   - Tokens signed with secure secret

2. **HTTP-Only Cookies:**
   - Refresh tokens stored in HTTP-only cookies
   - Protected from XSS attacks

3. **Session Tracking:**
   - Each session has unique ID
   - Track IP address & user agent
   - Auto-expire sessions after 7 days

4. **Token Refresh:**
   - Automatic refresh when token expires
   - Queue failed requests during refresh
   - Retry requests with new token

5. **Error Handling:**
   - 401 response → Automatic logout
   - Invalid token → Auto-login redirect
   - Token expired → Automatic refresh

---

## 📱 Contact Messages Storage

### Data Structure
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  message: String,
  createdAt: Date // Automatically set by MongoDB
}
```

### Accessing Messages in Admin Panel

1. Navigate to **Messages** page
2. View all contact submissions with:
   - Sender name
   - Email address
   - Submission date and time
   - Message preview

3. Actions available:
   - **View** - See full message in modal
   - **Delete** - Remove message from database
   - **Statistics** - See total, unread, read counts

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Solution: Whitelist your IP in MongoDB Atlas
1. Go to Network Access
2. Add IP Address
3. Use 0.0.0.0/0 for development (only!)
```

### Token Expired Error
```
Solution: Automatic refresh token handler
- Frontend automatically refreshes
- If refresh fails → User redirected to login
```

### CORS Error
```
Solution: Check FRONTEND_URL in .env
- Should match where frontend is running
- Default: http://localhost:5173
```

### Cannot Delete Messages
```
Solution: Verify JWT token
- Check if token is valid
- Token might have expired
- Try logging out and logging back in
```

---

## 📚 Additional Resources

- **JWT Docs:** https://jwt.io/
- **MongoDB Docs:** https://docs.mongodb.com/
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/

---

## ✅ Checklist

- [x] MongoDB connected with proper URI
- [x] Admin user initialized (devansh@gmail.com / gaurav@dev)
- [x] JWT authentication working
- [x] Refresh token system working
- [x] Session management implemented
- [x] Contact messages displaying in admin panel
- [x] Logout functionality (single & all sessions)
- [x] Frontend auto-token refresh
- [x] Error handling & redirects
- [x] Admin panel fully functional

---

## 🎉 You're All Set!

Your admin portal is ready to use. Login with the credentials and explore all features.

**Questions?** Check the documentation or test with the demo credentials.

Happy coding! 🚀
