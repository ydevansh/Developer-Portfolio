# Contact Form Backend Setup

This backend uses Node.js, Express, and MongoDB Atlas to store contact form submissions.

## Project Structure

```text
backend/
  config/
    database.js
  controllers/
    contactController.js
  middleware/
    validateRequest.js
  models/
    Contact.js
  routes/
    contact.js
  .env
  .env.example
  server.js
```

## Environment Variables

Create a `backend/.env` file with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=change_this_jwt_secret_in_production
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123
```

## Contact API

Public endpoint:

```http
POST /api/contact
Content-Type: application/json
```

Example request body:

```json
{
  "name": "Devansh Yadav",
  "email": "devansh@example.com",
  "message": "Hello, I would like to work with you."
}
```

Success response:

```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "_id": "mongo-id",
    "name": "Devansh Yadav",
    "email": "devansh@example.com",
    "message": "Hello, I would like to work with you.",
    "createdAt": "2026-04-16T00:00:00.000Z"
  }
}
```

## Run the Server

1. Open a terminal in `backend/`
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The backend will run at `http://localhost:5000`.
