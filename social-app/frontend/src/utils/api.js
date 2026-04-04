import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach JWT token ────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: handle auth errors globally ───────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clean up and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect here to avoid circular deps — let AuthContext handle it
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Posts API ────────────────────────────────────────────────────────────────
export const postsAPI = {
  getFeed: (page = 1, limit = 10) =>
    api.get(`/posts?page=${page}&limit=${limit}`),

  createPost: (formData) =>
    api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deletePost: (id) => api.delete(`/posts/${id}`),

  toggleLike: (id) => api.patch(`/posts/${id}/like`),

  addComment: (id, text) => api.post(`/posts/${id}/comments`, { text }),

  deleteComment: (postId, commentId) =>
    api.delete(`/posts/${postId}/comments/${commentId}`),
};

// ─── Users API ────────────────────────────────────────────────────────────────
export const usersAPI = {
  getProfile: (id) => id ? api.get(`/users/${id}`) : api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
};

export default api;
