import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        await apiClient.post('/api/auth/refresh');
        // Retry the original request
        return apiClient(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Authentication
  auth: {
    login: () => {
      window.location.href = `${API_BASE_URL}/api/auth/login`;
    },
    logout: () => apiClient.post('/api/auth/logout'),
    refresh: () => apiClient.post('/api/auth/refresh'),
  },

  // User
  user: {
    getProfile: () => apiClient.get('/api/user/profile'),
    getTopArtists: (timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') =>
      apiClient.get(`/api/user/top-artists?time_range=${timeRange}`),
    getTopTracks: (timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') =>
      apiClient.get(`/api/user/top-tracks?time_range=${timeRange}`),
  },

  // Preference Sharing
  preference: {
    createLink: () => apiClient.post('/api/preference/create-link'),
    getLink: (linkId: string) => apiClient.get(`/api/preference/link/${linkId}`),
    acceptLink: (linkId: string) => apiClient.post(`/api/preference/accept/${linkId}`),
    getMyLinks: () => apiClient.get('/api/preference/my-links'),
  },

  // Playlist
  playlist: {
    createBlend: () => apiClient.post('/api/playlist/create-blend'),
    getRecommendations: (params?: { seed_artists?: string; limit?: number }) =>
      apiClient.get('/api/playlist/recommendations', { params }),
    getMyPlaylists: () => apiClient.get('/api/playlist/my-playlists'),
    getPlaylist: (playlistId: string) => apiClient.get(`/api/playlist/${playlistId}`),
  },

  // Health check
  health: () => apiClient.get('/health'),
};

export default api;
