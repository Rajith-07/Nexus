import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, CircularProgress, Alert, Link,
} from '@mui/material';
import { Visibility, VisibilityOff, AutoAwesome, CheckCircle } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PasswordRequirement = ({ met, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
    <CheckCircle sx={{ fontSize: 13, color: met ? 'primary.main' : 'text.muted' }} />
    <Typography variant="caption" color={met ? 'primary.main' : 'text.secondary'}>{text}</Typography>
  </Box>
);

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pwChecks = {
    length: form.password.length >= 6,
    match: form.password === form.confirm && form.confirm.length > 0,
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pwChecks.length) return setError('Password must be at least 6 characters.');
    if (!pwChecks.match) return setError('Passwords do not match.');
    setLoading(true);
    setError('');
    try {
      await signup(form.username, form.email, form.password);
      toast.success('Account created! Welcome');
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.username && form.email && pwChecks.length && pwChecks.match;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background: 'radial-gradient(ellipse at 80% 20%, rgba(0,201,167,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,107,157,0.06) 0%, transparent 60%), #080D1A',
      }}
    >
      <Box sx={{ position: 'fixed', top: '15%', right: '8%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Box sx={{ width: '100%', maxWidth: 460, animation: 'fadeInUp 0.5s ease', '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>

        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #00C9A7, #0066FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AutoAwesome sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #00C9A7, #4DFFD4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Nexus
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Join the community today
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={0.5}>Create account</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Start sharing your world with others
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2, bgcolor: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.2)' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth label="Username" name="username"
                value={form.username} onChange={handleChange}
                required autoComplete="username"
                helperText="Letters, numbers, underscores only"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth label="Email address" name="email" type="email"
                value={form.email} onChange={handleChange}
                required autoComplete="email"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth label="Password" name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                required autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />

              {/* Password requirements */}
              {form.password && (
                <Box sx={{ mb: 2, pl: 0.5 }}>
                  <PasswordRequirement met={pwChecks.length} text="At least 6 characters" />
                </Box>
              )}

              <TextField
                fullWidth label="Confirm password" name="confirm"
                type={showPassword ? 'text' : 'password'}
                value={form.confirm} onChange={handleChange}
                required autoComplete="new-password"
                error={form.confirm.length > 0 && !pwChecks.match}
                helperText={form.confirm.length > 0 && !pwChecks.match ? "Passwords don't match" : ''}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={loading || !isFormValid}
                sx={{ height: 52, fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Create account'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SignupPage;
