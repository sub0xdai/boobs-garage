// src/utils/fetchWithAuth.js
const API_URL = 'http://localhost:5000'

const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/api/feedback',
  '/api/services',
  '/api/blog/posts'
]

const refreshToken = async () => {
  const response = await fetch(`${API_URL}/auth/refresh`, { method: 'POST' });
  if (!response.ok) throw new Error('Unable to refresh token');
  const { accessToken } = await response.json();
  localStorage.setItem('token', accessToken);
  return accessToken;
};

const fetchWithAuth = async (endpoint, options = {}) => {
  console.log('Checking auth for endpoint:', endpoint);
  console.log('Public routes:', publicRoutes);
  console.log('Is public route?', publicRoutes.some(route => endpoint.includes(route)));
  // Define public routes that don't require authentication
  
  let token = localStorage.getItem('token');
  // Only throw error if not a public route
  if (!token && !publicRoutes.some(route => endpoint.includes(route))) {
    console.log('Token required but missing for:', endpoint);
    throw new Error('No authentication token');
  }

  // Check if we're dealing with FormData
  const isFormData = options.body instanceof FormData;

  const config = {
    ...options,
    headers: {
      // Only set Content-Type if not FormData
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    }
  };

  // If body is an object but not FormData, stringify it
  if (options.body && !isFormData && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    let response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (response.status === 401 && token) {
      localStorage.removeItem('token');
      // Attempt to refresh the token
      try {
        token = await refreshToken();
        config.headers.Authorization = `Bearer ${token}`;
        response = await fetch(`${API_URL}${endpoint}`, config);
      } catch (error) {
        // Only redirect to login if it's not a public route
        if (!publicRoutes.some(route => endpoint.includes(route))) {
          window.location.href = '/login';
          throw new Error('Session expired - please login again');
        }
      }
    }
    
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const api = {
  get: (endpoint) => fetchWithAuth(endpoint),
  
  post: (endpoint, data) => {
    const config = {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data)
    };
    return fetchWithAuth(endpoint, config);
  },
  
  put: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (endpoint) => fetchWithAuth(endpoint, {
    method: 'DELETE'
  })
};

export default fetchWithAuth
