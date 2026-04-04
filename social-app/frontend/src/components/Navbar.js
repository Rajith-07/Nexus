import React, { useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, Avatar, IconButton,
  Menu, MenuItem, ListItemIcon, Divider, Button, Tooltip,
} from '@mui/material';
import {
  AutoAwesome, Logout, AccountCircle, DynamicFeed,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvatarGradient, getInitials } from '../utils/avatar';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(8, 13, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1E2B45',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ maxWidth: 680, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>

        {/* Logo */}
        <Box
          component={RouterLink}
          to={isAuthenticated ? '/feed' : '/'}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexGrow: 1 }}
        >
          <Box sx={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'linear-gradient(135deg, #00C9A7, #0066FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AutoAwesome sx={{ color: '#fff', fontSize: 16 }} />
          </Box>
          <Typography
            variant="h6" fontWeight={800}
            sx={{ background: 'linear-gradient(135deg, #00C9A7, #4DFFD4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}
          >
            Nexus
          </Typography>
        </Box>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Feed">
              <IconButton component={RouterLink} to="/feed" sx={{ color: 'text.secondary' }}>
                <DynamicFeed />
              </IconButton>
            </Tooltip>

            <Tooltip title={user?.username + " Profile"}>
              <IconButton component={RouterLink} to="/profile" sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                    background: getAvatarGradient(user?.username),
                  }}
                >
                  {getInitials(user?.username)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Tooltip title="Sign out">
              <IconButton onClick={handleLogout} sx={{ color: 'error.main', ml: 1 }}>
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={RouterLink} to="/login" variant="outlined" size="small">Sign in</Button>
            <Button component={RouterLink} to="/signup" variant="contained" size="small">Sign up</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
