import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import theme from './utils/theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Public feed (visible to all, full features for auth users) */}
                <Route path="/feed" element={<FeedPage />} />

                {/* Profile feature */}
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>

        {/* Toast notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#151E35',
              color: '#E8EDF5',
              border: '1px solid #252F4A',
              borderRadius: '12px',
              fontSize: '0.9rem',
              padding: '12px 18px',
            },
            success: {
              iconTheme: { primary: '#00C9A7', secondary: '#0F1629' },
              duration: 3000,
            },
            error: {
              iconTheme: { primary: '#FF5252', secondary: '#0F1629' },
              duration: 4000,
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
