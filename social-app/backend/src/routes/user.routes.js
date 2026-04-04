const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');

// GET current user profile details
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In post model the reference might be 'author' or 'user', need to check. Usually 'author'.
    // Let's check how many posts this user has created
    const postCount = await Post.countDocuments({ author: req.user._id || req.user.id });

    res.json({
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followersCount: user.followers ? user.followers.length : 0,
      followingCount: user.following ? user.following.length : 0,
      postCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error loading profile' });
  }
});

// UPDATE current user profile details
router.patch('/profile', protect, async (req, res) => {
  try {
    const { bio } = req.body;
    if (bio && bio.length > 150) {
      return res.status(400).json({ message: 'Bio cannot exceed 150 characters' });
    }
    
    // allow empty strings to clear bio
    const user = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      { bio: bio || '' },
      { new: true, runValidators: true }
    );
    
    res.json({ bio: user.bio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating profile' });
  }
});

// GET another user's profile details
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const postCount = await Post.countDocuments({ author: req.params.id });

    res.json({
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followersCount: user.followers ? user.followers.length : 0,
      followingCount: user.following ? user.following.length : 0,
      postCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error loading profile' });
  }
});

module.exports = router;
