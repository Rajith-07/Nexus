import React from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} | Rajith S
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link 
          href="https://github.com/Rajith-07/Nexus" 
          target="_blank" 
          rel="noopener noreferrer"
          underline="hover"
          color="text.secondary"
          sx={{ fontSize: '0.875rem', fontWeight: 500, '&:hover': { color: 'primary.main' } }}
        >
          Source Code
        </Link>
        <IconButton 
          component="a" 
          href="https://github.com/Rajith-07" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          sx={{ 
            color: 'text.secondary', 
            transition: 'color 0.2s ease',
            '&:hover': { color: 'primary.main' } 
          }}
        >
          <GitHubIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
