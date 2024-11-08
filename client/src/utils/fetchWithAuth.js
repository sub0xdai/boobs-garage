// src/utils/fetchWithAuth.js
const API_URL = 'http://localhost:5000'

const refreshToken = async () => {
  const response = await fetch(`${API_URL}/auth/refresh`, { method: 'POST' });
  if (!response.ok) throw new Error('Unable to refresh token');

  const { accessToken } = await response.json();
  localStorage.setItem('token', accessToken);
  return accessToken;
};



const fetchWithAuth = async (endpoint, options = {}) => {
  let token = localStorage.getItem('token');
  if (!token && !endpoint.includes('/login')) {
    throw new Error('No authentication token');
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    }
  };

  try {
    let response = await fetch(`${API_URL}${endpoint}`, config);
    if (response.status === 401) {
      localStorage.removeItem('token');

      // Attempt to refresh the token
      try {
        token = await refreshToken();
        config.headers.Authorization = `Bearer ${token}`;
        response = await fetch(`${API_URL}${endpoint}`, config);
      } catch (error) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        throw new Error('Session expired - please login again');
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
  
  post: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  put: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (endpoint) => fetchWithAuth(endpoint, {
    method: 'DELETE'
  })
}

export default fetchWithAuth
