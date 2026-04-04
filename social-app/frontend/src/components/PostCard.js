import React, { useState } from 'react';
import {
  Box, Card, CardContent, Avatar, Typography, IconButton,
  TextField, Button, Divider, Collapse, Menu, MenuItem,
  ListItemIcon, Tooltip, Chip,
} from '@mui/material';
import {
  Favorite, FavoriteBorder, ChatBubbleOutline, Delete,
  MoreVert, Send, ExpandMore, ExpandLess,
} from '@mui/icons-material';
import { format } from 'timeago.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/api';
import { getAvatarGradient, getInitials } from '../utils/avatar';
import toast from 'react-hot-toast';

const CommentItem = ({ comment, postId, onDeleted, currentUserId }) => {
  const canDelete = comment.userId === currentUserId || comment.userId?._id === currentUserId;

  const handleDelete = async () => {
    try {
      await postsAPI.deleteComment(postId, comment._id);
      onDeleted(comment._id);
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'flex-start' }}>
      <Avatar sx={{ width: 30, height: 30, fontSize: '0.65rem', flexShrink: 0, mt: 0.3, background: getAvatarGradient(comment.username) }}>
        {getInitials(comment.username)}
      </Avatar>
      <Box sx={{ flex: 1, background: '#1A2340', borderRadius: '12px', px: 1.5, py: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
          <Typography variant="caption" fontWeight={700} color="text.primary">{comment.username}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.muted">{format(comment.createdAt)}</Typography>
            {canDelete && (
              <IconButton size="small" onClick={handleDelete} sx={{ p: 0.2, color: 'text.muted', '&:hover': { color: 'error.main' } }}>
                <Delete sx={{ fontSize: 13 }} />
              </IconButton>
            )}
          </Box>
        </Box>
        <Typography variant="body2" sx={{ lineHeight: 1.5, color: 'text.secondary', fontSize: '0.85rem' }}>
          {comment.text}
        </Typography>
      </Box>
    </Box>
  );
};

const PostCard = ({ post: initialPost, onDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [imageExpanded, setImageExpanded] = useState(false);
  const navigate = useNavigate();

  const isOwner = user && (post.author === user._id || post.author?._id === user._id);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleLike = async () => {
    if (!isAuthenticated) return toast.error('Please sign in to like posts');
    if (likeLoading) return;
    setLikeLoading(true);

    // Optimistic update
    const wasLiked = post.likedByMe;
    setPost((p) => ({
      ...p,
      likedByMe: !wasLiked,
      likesCount: wasLiked ? p.likesCount - 1 : p.likesCount + 1,
    }));

    try {
      const { data } = await postsAPI.toggleLike(post._id);
      setPost((p) => ({ ...p, likedByMe: data.likedByMe, likesCount: data.likesCount }));
    } catch {
      // Revert on failure
      setPost((p) => ({ ...p, likedByMe: wasLiked, likesCount: wasLiked ? p.likesCount + 1 : p.likesCount - 1 }));
      toast.error('Failed to update like');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || commentLoading) return;
    if (!isAuthenticated) return toast.error('Please sign in to comment');
    setCommentLoading(true);
    try {
      const { data } = await postsAPI.addComment(post._id, commentText.trim());
      setPost((p) => ({
        ...p,
        comments: [...(p.comments || []), data.comment],
        commentsCount: data.commentsCount,
      }));
      setCommentText('');
      setShowComments(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentDeleted = (commentId) => {
    setPost((p) => ({
      ...p,
      comments: p.comments.filter((c) => c._id !== commentId),
      commentsCount: Math.max(0, p.commentsCount - 1),
    }));
    toast.success('Comment deleted');
  };

  const handleDeletePost = async () => {
    setMenuAnchor(null);
    try {
      await postsAPI.deletePost(post._id);
      toast.success('Post deleted');
      onDeleted?.(post._id);
    } catch {
      toast.error('Failed to delete post');
    }
  };

  return (
    <Card
      sx={{
        mb: 2.5,
        animation: 'fadeIn 0.4s ease',
        '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box 
            sx={{ display: 'flex', gap: 1.5, alignItems: 'center', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
            onClick={() => navigate(`/profile/${post.author?._id || post.author}`)}
          >
            <Avatar sx={{ width: 42, height: 42, fontWeight: 700, fontSize: '0.85rem', background: getAvatarGradient(post.authorUsername) }}>
              {getInitials(post.authorUsername)}
            </Avatar>
            <Box>
              <Typography fontWeight={700} variant="body2" sx={{ lineHeight: 1.2, '&:hover': { textDecoration: 'underline' } }}>
                @{post.authorUsername}
              </Typography>
              <Typography variant="caption" color="text.muted">
                {format(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          {isOwner && (
            <>
              <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ color: 'text.muted' }}>
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{ sx: { background: '#0F1629', border: '1px solid #1E2B45', borderRadius: 2 } }}
              >
                <MenuItem onClick={handleDeletePost} sx={{ color: 'error.main', gap: 1 }}>
                  <Delete fontSize="small" /> Delete post
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Post text */}
        {post.text && (
          <Typography
            variant="body1"
            sx={{ mb: post.image ? 1.5 : 0, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'text.primary', fontSize: '0.97rem' }}
          >
            {post.text}
          </Typography>
        )}

        {/* Post image */}
        {post.image && (
          <Box
            sx={{ mt: 1, mb: 0, borderRadius: 3, overflow: 'hidden', cursor: 'pointer', maxHeight: imageExpanded ? 'none' : 400, position: 'relative' }}
            onClick={() => setImageExpanded((s) => !s)}
          >
            <Box
              component="img"
              src={post.image}
              alt="Post"
              sx={{ width: '100%', objectFit: imageExpanded ? 'contain' : 'cover', maxHeight: imageExpanded ? 'none' : 400, display: 'block', borderRadius: 3, transition: 'all 0.3s ease' }}
            />
          </Box>
        )}

        {/* Action bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, pt: 1.5, borderTop: '1px solid #1A2340' }}>
          {/* Like button */}
          <Tooltip title={post.likedByMe ? 'Unlike' : 'Like'}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <IconButton
                onClick={handleLike}
                size="small"
                disabled={likeLoading}
                sx={{
                  color: post.likedByMe ? 'secondary.main' : 'text.muted',
                  transition: 'all 0.2s ease',
                  '&:hover': { color: 'secondary.main', transform: 'scale(1.2)' },
                  animation: post.likedByMe ? 'heartPop 0.3s ease' : 'none',
                  '@keyframes heartPop': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.35)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }}
              >
                {post.likedByMe ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
              </IconButton>
              <Typography variant="body2" color={post.likedByMe ? 'secondary.main' : 'text.secondary'} sx={{ fontWeight: 600, minWidth: 16 }}>
                {post.likesCount || 0}
              </Typography>
            </Box>
          </Tooltip>

          {/* Comment toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => setShowComments((s) => !s)}
              sx={{ color: showComments ? 'primary.main' : 'text.muted' }}
            >
              <ChatBubbleOutline fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, minWidth: 16 }}>
              {post.commentsCount || 0}
            </Typography>
          </Box>
        </Box>

        {/* Comment input */}
        {isAuthenticated && (
          <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1, mt: 1.5, alignItems: 'center' }}>
            <Avatar sx={{ width: 30, height: 30, fontSize: '0.65rem', flexShrink: 0, background: getAvatarGradient(user?.username) }}>
              {getInitials(user?.username)}
            </Avatar>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  background: '#1A2340',
                  fontSize: '0.85rem',
                },
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment(e);
                }
              }}
            />
            <IconButton
              type="submit"
              disabled={!commentText.trim() || commentLoading}
              size="small"
              sx={{
                color: commentText.trim() ? 'primary.main' : 'text.muted',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
            >
              <Send fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Comments list */}
        <Collapse in={showComments && (post.comments?.length > 0)}>
          <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #1A2340' }}>
            {post.comments?.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={post._id}
                onDeleted={handleCommentDeleted}
                currentUserId={user?._id}
              />
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PostCard;
