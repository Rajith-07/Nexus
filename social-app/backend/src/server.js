const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.example') });

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'https://your-frontend.vercel.app', // update after deployment
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/users', require('./routes/user.routes'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Social App API is running', status: 'OK' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Database Connection ───────────────────────────────────────────────────────
const decodeURIComponentSafe = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizeMongoUriCredentials = (uri) => {
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    return uri;
  }

  const protocolEnd = uri.indexOf('://') + 3;
  const pathStart = uri.indexOf('/', protocolEnd);
  const authorityEnd = pathStart === -1 ? uri.length : pathStart;
  const authority = uri.slice(protocolEnd, authorityEnd);
  const atIndex = authority.lastIndexOf('@');

  if (atIndex === -1) {
    return uri;
  }

  const credentials = authority.slice(0, atIndex);
  const host = authority.slice(atIndex + 1);
  const colonIndex = credentials.indexOf(':');

  if (colonIndex === -1) {
    return uri;
  }

  const rawUser = credentials.slice(0, colonIndex);
  const rawPass = credentials.slice(colonIndex + 1);
  const encodedUser = encodeURIComponent(decodeURIComponentSafe(rawUser));
  const encodedPass = encodeURIComponent(decodeURIComponentSafe(rawPass));

  if (encodedUser === rawUser && encodedPass === rawPass) {
    return uri;
  }

  return `${uri.slice(0, protocolEnd)}${encodedUser}:${encodedPass}@${host}${uri.slice(authorityEnd)}`;
};

const connectDB = async () => {
  try {
    const mongoUriRaw = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim();

    if (!mongoUriRaw) {
      throw new Error('Missing MONGODB_URI. Add it to backend/.env (or backend/.env.example for local fallback).');
    }

    const mongoUri = normalizeMongoUriCredentials(mongoUriRaw);

    await mongoose.connect(mongoUri);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
