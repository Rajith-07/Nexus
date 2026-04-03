import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { AutoAwesome, TrendingUp, ChatBubble, Favorite } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Feature = ({ icon, title, desc }) => (
  <Box
    sx={{
      p: 3, borderRadius: '20px', background: '#0F1629',
      border: '1px solid #1E2B45', textAlign: 'center',
      transition: 'all 0.3s ease',
      '&:hover': { borderColor: '#00C9A7', transform: 'translateY(-4px)', boxShadow: '0 8px 32px rgba(0,201,167,0.12)' },
    }}
  >
    <Box sx={{ width: 52, height: 52, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(0,201,167,0.15), rgba(0,102,255,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
      {icon}
    </Box>
    <Typography fontWeight={700} mb={0.5}>{title}</Typography>
    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{desc}</Typography>
  </Box>
);

const LandingPage = () => (
  <Box sx={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 20%, rgba(0,201,167,0.07) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(0,102,255,0.05) 0%, transparent 55%), #080D1A' }}>
    <Container maxWidth="md" sx={{ pt: { xs: 6, md: 10 }, pb: 8, textAlign: 'center' }}>

      {/* Badge */}
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 2, py: 0.8, borderRadius: '100px', background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.2)', mb: 4 }}>
        <AutoAwesome sx={{ fontSize: 14, color: 'primary.main' }} />
        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: '0.05em' }}>
          MINI SOCIAL APP
        </Typography>
      </Box>

      {/* Hero heading */}
      <Typography
        variant="h2"
        fontWeight={800}
        sx={{
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          mb: 2.5,
          fontSize: { xs: '2.4rem', md: '3.5rem' },
        }}
      >
        Share your world with{' '}
        <Box component="span" sx={{ background: 'linear-gradient(135deg, #00C9A7, #4DFFD4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Nexus
        </Box>
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 480, mx: 'auto', mb: 5, lineHeight: 1.8, fontSize: '1.05rem' }}
      >
        Post text and images, react to content from the community, and connect with people around you.
      </Typography>

      {/* CTAs */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 8 }}>
        <Button component={RouterLink} to="/signup" variant="contained" size="large" sx={{ px: 4, py: 1.5, fontSize: '1rem', borderRadius: '14px' }}>
          Get started — it's free
        </Button>
        <Button component={RouterLink} to="/feed" variant="outlined" size="large" sx={{ px: 4, py: 1.5, fontSize: '1rem', borderRadius: '14px' }}>
          Browse feed
        </Button>
      </Box>

      {/* Features grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5 }}>
        <Feature
          icon={<TrendingUp sx={{ color: 'primary.main' }} />}
          title="Public Feed"
          desc="See posts from everyone in a clean, real-time social feed."
        />
        <Feature
          icon={<Favorite sx={{ color: 'secondary.main' }} />}
          title="Likes"
          desc="React to posts you love with a single tap. Instant updates."
        />
        <Feature
          icon={<ChatBubble sx={{ color: '#A855F7' }} />}
          title="Comments"
          desc="Start conversations and reply to any post in the community."
        />
      </Box>
    </Container>
  </Box>
);

export default LandingPage;
