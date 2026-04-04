import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, CircularProgress, Divider, TextField, Button, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { getAvatarGradient, getInitials } from '../utils/avatar';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../utils/api';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  const isOwnProfile = !id || id === user?._id || id === user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await usersAPI.getProfile(id);
        setProfileData(data);
        setBioInput(data.bio || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]);

  const handleSaveBio = async () => {
    setSavingBio(true);
    try {
      const { data } = await usersAPI.updateProfile({ bio: bioInput.trim() });
      setProfileData((prev) => ({ ...prev, bio: data.bio }));
      setIsEditingBio(false);
    } catch (error) {
      console.error('Error saving bio:', error);
    } finally {
      setSavingBio(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6">Could not load profile.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
      <Box 
        sx={{ 
          background: '#0F1629', 
          border: '1px solid #1E2B45', 
          borderRadius: 4, 
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
          <Avatar
            sx={{
              width: 100, height: 100, fontSize: '2.5rem', fontWeight: 700,
              background: getAvatarGradient(profileData.username),
              boxShadow: '0 4px 15px rgba(0, 201, 167, 0.2)'
            }}
          >
            {getInitials(profileData.username)}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
             <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
               {profileData.username}
             </Typography>
             <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
               {profileData.email}
             </Typography>
             
             <Box sx={{ display: 'flex', gap: 4 }}>
               <Box sx={{ textAlign: 'center' }}>
                 <Typography variant="h6" fontWeight={700}>{profileData.postCount}</Typography>
                 <Typography variant="body2" color="text.secondary">Posts</Typography>
               </Box>
               <Box sx={{ textAlign: 'center' }}>
                 <Typography variant="h6" fontWeight={700}>{profileData.followersCount}</Typography>
                 <Typography variant="body2" color="text.secondary">Followers</Typography>
               </Box>
               <Box sx={{ textAlign: 'center' }}>
                 <Typography variant="h6" fontWeight={700}>{profileData.followingCount}</Typography>
                 <Typography variant="body2" color="text.secondary">Following</Typography>
               </Box>
             </Box>
          </Box>
        </Box>
        
        <Divider sx={{ width: '100%', my: 3, borderColor: '#1E2B45' }} />
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight={700}>About</Typography>
            {isOwnProfile && !isEditingBio && (
              <IconButton onClick={() => setIsEditingBio(true)} size="small" sx={{ color: 'text.secondary' }}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          {isEditingBio ? (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="Tell us about yourself..."
                disabled={savingBio}
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 150 }}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="inherit" 
                  onClick={() => { setIsEditingBio(false); setBioInput(profileData.bio || ''); }}
                  disabled={savingBio}
                >
                  Cancel
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={handleSaveBio}
                  disabled={savingBio}
                >
                  {savingBio ? <CircularProgress size={20} color="inherit" /> : 'Save'}
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: profileData.bio ? '#E8EDF5' : 'text.muted', fontStyle: profileData.bio ? 'normal' : 'italic' }}>
              {profileData.bio || 'No bio added yet.'}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
