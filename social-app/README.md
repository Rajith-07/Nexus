# Nexus — Mini Social Post Application

> A full-stack social media app where users can create accounts, post text and images, like and comment on posts. Built for the 3W Full Stack Internship Assignment.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Node](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb) ![MUI](https://img.shields.io/badge/MUI-v5-007FFF?logo=mui)

---

## Features

- **Authentication** — Signup / Login with JWT. Passwords hashed with bcrypt (12 rounds).
- **Create Posts** — Share text, image, or both. Images uploaded to Cloudinary (max 5 MB).
- **Public Feed** — All posts from all users, newest first. Infinite scroll pagination.
- **Likes** — Toggle like/unlike with instant optimistic UI updates.
- **Comments** — Add and delete comments on any post. Real-time count updates.
- **Responsive** — Works on mobile, tablet and desktop.
- **Dark theme** — Custom MUI dark theme with teal accent.

---

## Tech Stack

| Layer     | Technology                      |
|-----------|----------------------------------|
| Frontend  | React 18, React Router v6, MUI v5 |
| Backend   | Node.js, Express 4               |
| Database  | MongoDB Atlas (2 collections)    |
| Auth      | JWT + bcryptjs                   |
| Images    | Cloudinary + Multer              |
| Deploy FE | Vercel                           |
| Deploy BE | Render                           |

---

## MongoDB Collections

Only **2 collections** are used as required:

### `users`
```json
{
  "_id": "ObjectId",
  "username": "string (unique)",
  "email": "string (unique)",
  "password": "string (hashed)",
  "avatar": "string",
  "bio": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### `posts`
```json
{
  "_id": "ObjectId",
  "author": "ObjectId (ref: User)",
  "authorUsername": "string",
  "authorAvatar": "string",
  "text": "string (optional)",
  "image": "string (Cloudinary URL, optional)",
  "imagePublicId": "string",
  "likes": ["ObjectId"],
  "comments": [{
    "_id": "ObjectId",
    "userId": "ObjectId",
    "username": "string",
    "text": "string",
    "createdAt": "Date"
  }],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Project Structure

```
social-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # Signup, login, getMe
│   │   │   └── post.controller.js      # Feed, create, delete, like, comment
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js      # JWT protect middleware
│   │   │   └── upload.middleware.js    # Multer + Cloudinary config
│   │   ├── models/
│   │   │   ├── User.js                 # User schema + password hashing
│   │   │   └── Post.js                 # Post + embedded comments schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js          # /api/auth/*
│   │   │   └── post.routes.js          # /api/posts/*
│   │   └── server.js                   # Express app entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js               # Top navigation bar
│   │   │   ├── CreatePost.js           # Post composer with image upload
│   │   │   ├── PostCard.js             # Feed card with like/comment
│   │   │   └── ProtectedRoute.js       # Auth guard for routes
│   │   ├── context/
│   │   │   └── AuthContext.js          # Global auth state
│   │   ├── pages/
│   │   │   ├── LandingPage.js          # Homepage for guests
│   │   │   ├── LoginPage.js            # Login form
│   │   │   ├── SignupPage.js           # Signup form
│   │   │   └── FeedPage.js             # Main social feed
│   │   ├── utils/
│   │   │   ├── api.js                  # Axios client + all API calls
│   │   │   ├── theme.js                # MUI custom dark theme
│   │   │   └── avatar.js               # Initials + gradient helpers
│   │   ├── App.js                      # Router + providers
│   │   └── index.js                    # React entry point
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
├── render.yaml                         # Render deployment config
├── .gitignore
└── README.md
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Create new account |
| POST | `/login` | No | Login, returns JWT |
| GET | `/me` | Yes | Get current user |

### Posts — `/api/posts`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Optional | Get paginated feed |
| POST | `/` | Yes | Create post (text/image) |
| DELETE | `/:id` | Yes | Delete own post |
| PATCH | `/:id/like` | Yes | Toggle like |
| POST | `/:id/comments` | Yes | Add comment |
| DELETE | `/:id/comments/:cid` | Yes | Delete own comment |

Query params for GET `/`: `?page=1&limit=10`

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/social-app.git
cd social-app
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/social-app
JWT_SECRET=your_random_secret_at_least_32_chars
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev    # Starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
npm start      # Starts on http://localhost:3000
```

---

## Deployment

### Step 1 — MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Add a database user
3. Whitelist `0.0.0.0/0` (all IPs) for Render compatibility
4. Copy your connection string

### Step 2 — Cloudinary
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Copy your Cloud Name, API Key, and API Secret from the dashboard

### Step 3 — Backend on Render
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root directory**: `backend`
   - **Build command**: `npm install`
   - **Start command**: `npm start`
5. Add all environment variables from `.env.example`
6. Deploy — copy your Render URL (e.g. `https://social-app-api.onrender.com`)

### Step 4 — Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Settings:
   - **Root directory**: `frontend`
   - **Framework preset**: Create React App
4. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
5. Update `backend/.env` `CLIENT_URL` to your Vercel URL and redeploy backend
6. Deploy!

---

## Design Decisions

- **Embedded comments** — Comments are stored as subdocuments in the Post document. This avoids needing a third collection and is efficient for the expected scale.
- **Denormalized author fields** — `authorUsername` and `authorAvatar` are stored on each post to avoid population on every feed query, keeping the feed fast.
- **Optimistic UI for likes** — The like button updates immediately in the UI before the API call completes, with automatic rollback on failure.
- **Infinite scroll** — Uses `IntersectionObserver` for efficient scroll detection without event listeners.
- **JWT in localStorage** — Simple and sufficient for this use case. Token verified on every app mount via `/api/auth/me`.

---

## License
MIT
