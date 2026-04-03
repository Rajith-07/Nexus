const Post = require('../models/Post');
const { cloudinary } = require('../middleware/upload.middleware');

/**
 * GET /api/posts
 * Fetch paginated public feed — newest first.
 * Query params: page (default 1), limit (default 10)
 */
const getFeed = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }), // lean for performance; virtuals still computed
      Post.countDocuments(),
    ]);

    // Attach "likedByMe" flag if user is authenticated
    const userId = req.user?._id?.toString();
    const enriched = posts.map((post) => ({
      ...post,
      likedByMe: userId ? post.likes.some((id) => id.toString() === userId) : false,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
    }));

    res.json({
      posts: enriched,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total,
      },
    });
  } catch (err) {
    console.error('Get feed error:', err);
    res.status(500).json({ message: 'Failed to load feed.' });
  }
};

/**
 * POST /api/posts
 * Create a new post. Requires auth.
 * Body: { text? } | multipart with image field
 */
const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const imageFile = req.file; // Set by multer if image uploaded

    // At least one of text or image must be provided
    if (!text?.trim() && !imageFile) {
      return res.status(400).json({ message: 'Post must include text or an image.' });
    }

    const postData = {
      author: req.user._id,
      authorUsername: req.user.username,
      authorAvatar: req.user.avatar || '',
    };

    if (text?.trim()) postData.text = text.trim();
    if (imageFile) {
      postData.image = imageFile.path;           // Cloudinary secure URL
      postData.imagePublicId = imageFile.filename; // For future deletion
    }

    const post = await Post.create(postData);

    res.status(201).json({
      message: 'Post created!',
      post: {
        ...post.toObject(),
        likedByMe: false,
        likesCount: 0,
        commentsCount: 0,
      },
    });
  } catch (err) {
    // Clean up uploaded image if post creation fails
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename).catch(() => {});
    }
    console.error('Create post error:', err);
    res.status(500).json({ message: err.message || 'Failed to create post.' });
  }
};

/**
 * DELETE /api/posts/:id
 * Delete a post. Only the author can delete.
 */
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }

    // Remove image from Cloudinary if present
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId).catch(() => {});
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted.' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ message: 'Failed to delete post.' });
  }
};

/**
 * PATCH /api/posts/:id/like
 * Toggle like on a post. Returns updated like count.
 */
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const userId = req.user._id;
    const alreadyLiked = post.likes.some((id) => id.equals(userId));

    if (alreadyLiked) {
      // Unlike: remove user from likes array
      post.likes = post.likes.filter((id) => !id.equals(userId));
    } else {
      // Like: add user to likes array
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      likesCount: post.likes.length,
      likedByMe: !alreadyLiked,
    });
  } catch (err) {
    console.error('Toggle like error:', err);
    res.status(500).json({ message: 'Failed to update like.' });
  }
};

/**
 * POST /api/posts/:id/comments
 * Add a comment to a post.
 */
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const comment = {
      userId: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar || '',
      text: text.trim(),
    };

    post.comments.push(comment);
    await post.save();

    // Return the newly added comment (last item)
    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: 'Comment added!',
      comment: newComment,
      commentsCount: post.comments.length,
    });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ message: 'Failed to add comment.' });
  }
};

/**
 * DELETE /api/posts/:id/comments/:commentId
 * Delete a comment. Only the comment author can delete.
 */
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment.' });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: 'Comment deleted.', commentsCount: post.comments.length });
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ message: 'Failed to delete comment.' });
  }
};

/**
 * GET /api/posts/:id
 * Get a single post with all comments.
 */
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean({ virtuals: true });
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const userId = req.user?._id?.toString();
    res.json({
      post: {
        ...post,
        likedByMe: userId ? post.likes.some((id) => id.toString() === userId) : false,
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
      },
    });
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ message: 'Failed to get post.' });
  }
};

module.exports = { getFeed, createPost, deletePost, toggleLike, addComment, deleteComment, getPost };
