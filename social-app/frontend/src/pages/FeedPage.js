import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, CircularProgress, Button, Skeleton, Alert, IconButton
} from '@mui/material';
import { Refresh, Explore } from '@mui/icons-material';
import { postsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

// Skeleton placeholder while posts load
const PostSkeleton = () => (
  <Box sx={{ mb: 2.5, background: '#0F1629', borderRadius: '20px', p: 3, border: '1px solid #1E2B45' }}>
    <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
      <Skeleton variant="circular" width={42} height={42} sx={{ bgcolor: '#1A2340' }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="30%" height={18} sx={{ bgcolor: '#1A2340', mb: 0.5 }} />
        <Skeleton variant="text" width="20%" height={14} sx={{ bgcolor: '#1A2340' }} />
      </Box>
    </Box>
    <Skeleton variant="text" width="90%" sx={{ bgcolor: '#1A2340', mb: 0.5 }} />
    <Skeleton variant="text" width="75%" sx={{ bgcolor: '#1A2340', mb: 0.5 }} />
    <Skeleton variant="text" width="60%" sx={{ bgcolor: '#1A2340', mb: 2 }} />
    <Skeleton variant="rectangular" height={200} sx={{ bgcolor: '#1A2340', borderRadius: 2 }} />
  </Box>
);

const FeedPage = () => {
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, hasMore: true, totalPages: 1 });
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // ─── Fetch posts ─────────────────────────────────────────────────────────────
  const fetchPosts = useCallback(async (page = 1, replace = false) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    setError('');

    try {
      const { data } = await postsAPI.getFeed(page, 10);
      setPosts((prev) => replace ? data.posts : [...prev, ...data.posts]);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  // ─── Infinite scroll using IntersectionObserver ───────────────────────────
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && pagination.hasMore && !loadingMore && !loading) {
          fetchPosts(pagination.page + 1);
        }
      },
      { rootMargin: '200px' }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [pagination, loadingMore, loading, fetchPosts]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handlePostCreated = (newPost) => {
    // Prepend new post to feed instantly
    setPosts((prev) => [newPost, ...prev]);
    setPagination((p) => ({ ...p, total: p.total + 1 }));
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setPagination((p) => ({ ...p, total: Math.max(0, p.total - 1) }));
  };

  const handleRefresh = () => {
    fetchPosts(1, true);
  };

  return (
    <Box
      sx={{
        maxWidth: 640,
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        pt: { xs: 2, sm: 3 },
        pb: 8,
      }}
    >
      {/* Feed header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
            Feed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pagination.total > 0 ? `${pagination.total} posts` : 'No posts yet'}
          </Typography>
        </Box>
        <IconButton
          onClick={handleRefresh}
          disabled={loading}
          aria-label="Refresh feed"
          sx={{ 
            border: (theme) => `1px solid ${theme.palette.divider}`, 
            borderRadius: '10px' 
          }}
        >
          <Refresh />
        </IconButton>
      </Box>

      {/* Create post box — only for authenticated users */}
      {isAuthenticated && <CreatePost onPostCreated={handlePostCreated} />}

      {/* Error state */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 3, bgcolor: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.2)' }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>Retry</Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Initial loading skeletons */}
      {loading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}

      {/* Post list */}
      {!loading && posts.length === 0 && !error && (
        <Box
          sx={{
            textAlign: 'center', py: 8,
            background: '#0F1629', borderRadius: '20px',
            border: '1px solid #1E2B45',
          }}
        >
          <Explore sx={{ fontSize: 56, color: 'text.muted', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} mb={1}>No posts yet</Typography>
          <Typography color="text.secondary" variant="body2">
            {isAuthenticated ? 'Be the first to share something!' : 'Sign in to start posting.'}
          </Typography>
        </Box>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDeleted={handlePostDeleted} />
      ))}

      {/* Infinite scroll sentinel */}
      <Box ref={sentinelRef} sx={{ height: 20 }} />

      {/* Load more spinner */}
      {loadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={28} color="primary" />
        </Box>
      )}

      {/* End of feed message */}
      {!loading && !loadingMore && !pagination.hasMore && posts.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.muted">
            You've reached the end of the feed
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FeedPage;
