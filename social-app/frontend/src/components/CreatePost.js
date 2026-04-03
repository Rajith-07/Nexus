import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Avatar,
  IconButton, Typography, LinearProgress, Tooltip, Collapse,
} from '@mui/material';
import { Image, Close, Send, EmojiEmotions } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/api';
import { getAvatarGradient, getInitials } from '../utils/avatar';
import toast from 'react-hot-toast';

const MAX_CHARS = 1000;

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const charsLeft = MAX_CHARS - text.length;
  const isOverLimit = charsLeft < 0;
  const canSubmit = (text.trim() || imageFile) && !isOverLimit && !loading;

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);

    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (imageFile) formData.append('image', imageFile);

      const { data } = await postsAPI.createPost(formData);
      toast.success('Post shared!');
      setText('');
      removeImage();
      setFocused(false);
      onPostCreated?.(data.post);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Card sx={{ mb: 3, overflow: 'visible' }}>
      {loading && (
        <LinearProgress
          sx={{ borderRadius: '20px 20px 0 0', height: 3 }}
          color="primary"
        />
      )}
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          {/* User avatar */}
          <Avatar
            sx={{
              width: 42, height: 42, flexShrink: 0, mt: 0.5,
              background: getAvatarGradient(user?.username),
              fontWeight: 700, fontSize: '0.85rem',
            }}
          >
            {getInitials(user?.username)}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <TextField
              multiline
              fullWidth
              minRows={focused ? 3 : 1}
              maxRows={8}
              placeholder={`What's on your mind, ${user?.username}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: '#1A2340',
                  borderRadius: '14px',
                  fontSize: '0.97rem',
                  lineHeight: 1.6,
                  transition: 'all 0.2s ease',
                },
              }}
            />

            {/* Image preview */}
            <Collapse in={!!imagePreview}>
              {imagePreview && (
                <Box sx={{ mt: 2, position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      maxWidth: '100%', maxHeight: 300, borderRadius: 3,
                      objectFit: 'cover', display: 'block',
                      border: '1px solid #252F4A',
                    }}
                  />
                  <IconButton
                    onClick={removeImage}
                    size="small"
                    sx={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'rgba(0,0,0,0.7)', color: '#fff',
                      '&:hover': { background: 'rgba(0,0,0,0.85)' },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Collapse>

            {/* Action bar */}
            <Collapse in={focused || !!text || !!imageFile}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 1.5, borderTop: '1px solid #1E2B45' }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageSelect}
                  />
                  <Tooltip title="Add image">
                    <IconButton
                      onClick={() => fileInputRef.current?.click()}
                      size="small"
                      disabled={loading}
                      sx={{ color: imageFile ? 'primary.main' : 'text.secondary' }}
                    >
                      <Image fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {text.length > 0 && (
                    <Typography
                      variant="caption"
                      sx={{ color: isOverLimit ? 'error.main' : charsLeft < 100 ? 'warning.main' : 'text.muted' }}
                    >
                      {charsLeft}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    endIcon={<Send sx={{ fontSize: '14px !important' }} />}
                    sx={{ borderRadius: '10px', px: 2.5, py: 0.8 }}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
