const mongoose = require('mongoose');

/**
 * Comment Sub-document Schema
 * Embedded within Post to avoid a third collection.
 */
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

/**
 * Post Schema
 * Supports text and/or image posts.
 * Likes stored as array of user IDs for uniqueness enforcement.
 */
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Denormalized for fast feed rendering (avoids populate on every list query)
    authorUsername: {
      type: String,
      required: true,
    },
    authorAvatar: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      trim: true,
      maxlength: [1000, 'Post text cannot exceed 1000 characters'],
    },
    image: {
      type: String, // Cloudinary URL
      default: null,
    },
    imagePublicId: {
      type: String, // Cloudinary public_id for deletion
      default: null,
    },
    // Array of user ObjectIds who liked this post (ensures one like per user)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Embedded comments array (max ~100 comments per post is fine for this scale)
    comments: [commentSchema],
  },
  {
    timestamps: true,
    // Virtual for counts
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtuals ─────────────────────────────────────────────────────────────────
postSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

postSchema.virtual('commentsCount').get(function () {
  return this.comments.length;
});

// ─── Index for fast feed queries (newest first) ────────────────────────────────
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });

// ─── Validate at least text or image is present ───────────────────────────────
postSchema.pre('save', function (next) {
  if (!this.text && !this.image) {
    return next(new Error('Post must have either text or an image'));
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
