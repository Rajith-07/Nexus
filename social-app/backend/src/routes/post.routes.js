const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const {
  getFeed,
  createPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getPost,
} = require('../controllers/post.controller');

const router = express.Router();

// Feed — optionally authenticated (for likedByMe flag)
router.get('/', (req, res, next) => {
  // Optionally attach user if token present, but don't require it
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return protect(req, res, () => getFeed(req, res, next));
  }
  getFeed(req, res, next);
});

// Single post
router.get('/:id', getPost);

// Create post — requires auth + optional image upload
router.post('/', protect, upload.single('image'), createPost);

// Delete post — requires auth
router.delete('/:id', protect, deletePost);

// Like/unlike — requires auth
router.patch('/:id/like', protect, toggleLike);

// Comment routes — requires auth
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
