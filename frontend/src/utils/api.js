import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${API_BASE_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'thrifthub_token';
const USER_KEY = 'thrifthub_user';

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Initialize token if exists
const existingToken = localStorage.getItem(TOKEN_KEY);
if (existingToken) {
  setAuthToken(existingToken);
}

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { access_token, user } = response.data;
    setAuthToken(access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { access_token, user } = response.data;
    setAuthToken(access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return response.data;
  },

  logout: () => {
    setAuthToken(null);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Products API
export const productsAPI = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    // Convert to FormData for file uploads
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        // Handle images array
        productData.images.forEach((image, index) => {
          formData.append('images', image);
        });
      } else if (key === 'tags') {
        // Convert tags array to comma-separated string
        formData.append('tags', productData.tags.join(', '));
      } else {
        formData.append(key, productData[key]);
      }
    });

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  searchProducts: async (searchQuery, filters = {}) => {
    const params = {
      search: searchQuery,
      ...filters
    };
    const response = await api.get('/products', { params });
    return response.data;
  }
};

// Favorites API
export const favoritesAPI = {
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  addFavorite: async (productId) => {
    const response = await api.post(`/favorites/${productId}`);
    return response.data;
  },

  removeFavorite: async (productId) => {
    const response = await api.delete(`/favorites/${productId}`);
    return response.data;
  }
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      setAuthToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;