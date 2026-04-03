const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Protect routes requiring authentication.
 * Reads Bearer token from Authorization header, verifies it,
 * and attaches the user document to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Please log in.' });
  }

  try {
    // Verify and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user (without password) to request
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token. Please log in again.' });
  }
};

module.exports = { protect };
